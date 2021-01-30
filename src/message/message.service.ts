import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from '../user/db/user.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { GetMessageOutput } from './dto/get-message.output';
import { SocketService } from '../socket/socket.service';
import { MessageRepository } from './db/message.repository';
import { ChatRepository } from '../chat/db/chat.repository';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class MessageService {
  public constructor(
    private readonly messageRepository: MessageRepository,
    private readonly socketService: SocketService,
    private readonly chatService: ChatService,
    private readonly chatRepository: ChatRepository,
  ) {}

  public async get(
    currentUser: User,
    chatId: number,
  ): Promise<GetMessageOutput[]> {
    const chat = await this.chatRepository.findById(chatId);

    if (!this.chatService.hasUserWithId(chat, currentUser.id)) {
      throw new ForbiddenException();
    }

    const messages = await this.messageRepository.getByChatId(chatId);

    return messages.sort((a, b) => a.id - b.id);
  }

  public async send(
    from: User,
    input: CreateMessageInput,
  ): Promise<GetMessageOutput> {
    const chat = await this.chatRepository.findById(input.chatId);

    if (!chat || !this.chatService.hasUserWithId(chat, from.id)) {
      throw new BadRequestException('chat not found');
    }

    const message = await this.messageRepository.save({
      from,
      chat,
      text: input.text,
    });

    const resp = new GetMessageOutput(message.id, message.text, from, chat);

    this.push(chat.users, from, resp);

    return resp;
  }

  private push(users: User[], from: User, message: GetMessageOutput): void {
    users.map((user) => {
      if (user.id !== from.id)
        this.socketService.server.to(`${user.id}`).emit('inc_msg', { message });
    });
  }
}
