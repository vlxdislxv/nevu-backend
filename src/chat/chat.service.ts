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

    return chatsWithMembers.map(
      (chat) =>
        new GetChatOutput(
          chat.id,
          chat.name,
          !!chat.users.find((u) => u.isOnline(this.socketService)),
        ),
    );
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

    const chat = new Chat(users, this.generateChatName(users));

    return chat.save(this.chatRepository);
  }

  private generateChatName(users: User[]): string {
    let chatName = '';
    users.map(user => {chatName += `${user.fullName},`});
    chatName = chatName.substring(0, chatName.length - 1);
    return chatName;
  }

  public findById(chatId: number): Promise<Chat> {
    return this.chatRepository
    .createQueryBuilder('chat')
    .leftJoinAndSelect('chat.users', 'user')
    .where('chat.id = :chatId', { chatId })
    .getOne();
  }
}
