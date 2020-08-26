import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetChatOutput } from './dto/get-chat.output';
import { Chat } from './models/chat.entity';
import { User } from '../user/models/user.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { unique } from '../common/helpers/funcs';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class ChatService {
  public constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly socketService: SocketService,
  ) {}

  public async getChats(uid: number): Promise<GetChatOutput[]> {
    const server = this.socketService.server;

    const chats = await this.chatRepository.createQueryBuilder('chat')
      .select(['chat.id', 'chat.name'])
      .leftJoin('chat.users', 'user')
      .where('user.id = :uid', { uid })
      .limit(15)
      .getMany();

    const chatIds = [-1, ...chats.map(chat => chat.id)];

    const chatsWithMembers = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'user')
      .where('user.id != :uid and chat.id IN (:...chatIds)', { uid, chatIds })
      .getMany();

    chatsWithMembers.map(chat => chat.users.map(user => {
      const room = server.sockets.adapter.rooms[user.id.toString()];
      chat.online = room !== undefined;
    }));

    return chatsWithMembers;
  }

  public async create(users: User[]): Promise<Chat> {
    let chatName = '';
    users.map(user => {chatName += `${user.fullName},`});
    chatName = chatName.substring(0, chatName.length - 1);

    const chat = new Chat();
    chat.messages = [];
    chat.users = users;
    chat.name = chatName;

    return this.chatRepository.save(chat);
  }

  public async createChat(currUser: User, createChat: CreateChatInput): Promise<GetChatOutput> {
    if (createChat.with.length > 5) {
      throw new BadRequestException('with[] is too long');
    }

    const ids = [...createChat.with, currUser.id].filter(unique);

    if (ids.length <= 1) {
      throw new BadRequestException('with[] is too small');
    }

    const users = await this.userRepository.findByIds(ids);

    if (users.length !== ids.length) {
      throw new BadRequestException('with[] is invalid');
    }

    return this.create(users);
  }

  public chatHasUser(user: User, chat: Chat): boolean {
    return chat.users.find(cUser => cUser.id === user.id) && true;
  }
}
