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
import { SocketService } from '../socket/socket.service';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class MessageService {
  public constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    private readonly socketService: SocketService,
    private readonly chatService: ChatService
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

    return messages.sort((a, b) => a.id - b.id);
  }

  async createMessage(from: User, chat: Chat, text: string): Promise<Message> {
    const message = new Message();

    message.text = text;
    message.chat = chat;
    message.from = from;

    return this.messageRepository.save(message);
  }

  async sendMessage(
    from: User,
    input: CreateMessageInput,
  ): Promise<GetMessageOutput> {
    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'user')
      .where('chat.id = :chatId', { chatId: input.chatId })
      .getOne();

    if (!chat || !this.chatService.chatHasUser(from, chat)) {
      throw new BadRequestException('chat not found');
    }

    const message = await this.createMessage(from, chat, input.text);

    const resp: GetMessageOutput = {
      id: message.id,
      from: {
        id: message.from.id,
        username: message.from.username,
        fullName: message.from.fullName,
      },
      chat: {
        id: message.chat.id,
        name: message.chat.name,
      },
      text: message.text,
    };

    chat.users.map(user => {
      if (user.id !== from.id)
        this.socketService.server
          .to(`${user.id}`)
          .emit('inc_msg', { message: resp });
    });

    return resp;
  }
}
