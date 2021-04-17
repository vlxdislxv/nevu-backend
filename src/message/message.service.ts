import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from '../user/core/db/user.entity';
import { CreateMessageInput } from './core/dto/create-message.input';
import { GetMessageOutput } from './core/dto/get-message.output';
import { MessageRepository } from './core/db/message.repository';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class MessageService {
  public constructor(
    private readonly messageRepository: MessageRepository,
    private readonly chatService: ChatService,
  ) {}

  public async get(
    currentUser: User,
    chatId: number,
  ): Promise<GetMessageOutput[]> {
    const chat = await this.chatService.findOfUser(chatId, currentUser.id);

    if (!chat) {
      throw new BadRequestException('chat not found');
    }

    const messages = await this.messageRepository.getByChatId(chatId);

    return messages.sort((a, b) => a.id - b.id);
  }

  public async send(
    from: User,
    input: CreateMessageInput,
  ): Promise<GetMessageOutput> {
    const chat = await this.chatService.findOfUser(input.chatId, from.id);

    if (!chat) {
      throw new BadRequestException('chat not found');
    }

    const message = await this.messageRepository.save({
      from,
      chat,
      text: input.text,
    });

    const resp = new GetMessageOutput(message.id, message.text, from);

    this.push(chat.users, from, resp);

    return resp;
  }

  private push(users: User[], from: User, message: GetMessageOutput): void {
    users.map((user) => {
      if (user.id !== from.id) {
        console.log('notify', message);
      }
    });
  }
}
