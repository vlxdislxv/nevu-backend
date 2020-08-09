import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/models/user.entity';
import { Message } from './models/message.entity';
import { Repository } from 'typeorm';
import { Chat } from '../chat/models/chat.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { GetMessageOutput } from './dto/get-message.output';

@Injectable()
export class MessageService {
  public constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async getMessages(uid: number, chatId: number): Promise<GetMessageOutput[]> {
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.chat', 'chat')
      .leftJoin('chat.users', 'user')
      .leftJoinAndSelect('message.from', 'from')
      .where('user.id = :uid and message.chat = :chatId', { uid, chatId })
      .limit(15)
      .orderBy('message.id', 'DESC')
      .getMany();

    return messages;
  }

  async createMessage(from: User, chat: Chat, text: string): Promise<Message> {
    const message = new Message();

    message.text = text;
    message.chat = chat;
    message.from = from;

    return this.messageRepository.save(message);
  }

  async sendMessage(from: User, input: CreateMessageInput): Promise<GetMessageOutput> {
    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoin('chat.users', 'user')
      .where('user.id = :uid and chat.id = :chatId', { uid: from.id, chatId: input.chatId })
      .getOne();

    if (!chat) {
      throw new BadRequestException('chat not found');
    }

    const message = await this.createMessage(from, chat, input.text);

    return {...message};
  }
}
