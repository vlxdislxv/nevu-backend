import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetChatOutput } from './dto/get-chat.output';
import { Chat } from './models/chat.entity';
import { User } from '../user/models/user.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { unique } from '../common/helpers/funcs';

@Injectable()
export class ChatService {
  public constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  public async getChats(uid: number): Promise<GetChatOutput[]> {
    const chats = await this.chatRepository
      .createQueryBuilder('chat')
      .select(['chat.id', 'chat.name'])
      .leftJoin('chat.users', "user")
      .where("user.id = :uid", { uid })
      .getMany();

    return chats;
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
}
