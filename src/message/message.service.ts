import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/models/user.entity';
import { Message } from './models/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageInput } from './dto/create-message.input';
import { GetMessageOutput } from './dto/get-message.output';
import { SocketService } from '../socket/socket.service';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class MessageService {
  public constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly socketService: SocketService,
    private readonly chatService: ChatService,
  ) {}

  public async getMessages(
    uid: number,
    chatId: number,
  ): Promise<GetMessageOutput[]> {
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

  public async sendMessage(
    from: User,
    input: CreateMessageInput,
  ): Promise<GetMessageOutput> {
    const chat = await this.chatService.findById(input.chatId);

    if (!this.chatService.hasUserWithId(chat, from.id)) {
      throw new BadRequestException('chat not found');
    }

    const message = await this.messageRepository.save({ from, chat, text: input.text });

    const resp = new GetMessageOutput(message.id, message.text, from, chat);

    this.pushMessage(chat.users, from, resp);

    return resp;
  }

  private pushMessage(
    users: User[],
    from: User,
    message: GetMessageOutput,
  ): void {
    users.map((user) => {
      if (user.id !== from.id)
        this.socketService.server.to(`${user.id}`).emit('inc_msg', { message });
    });
  }
}
