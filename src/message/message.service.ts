import { Injectable } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { User } from '../user/core/db/user.entity';
import { CreateMessageInput } from './core/dto/create-message.input';
import { Message } from './core/dto/message.output';
import { MessageRepository } from './core/db/message.repository';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class MessageService {
  public constructor(
    private readonly messageRepository: MessageRepository,
    private readonly chatService: ChatService,
    private readonly pubSub: RedisPubSub,
  ) {}

  public async get(currentUser: User, chatId: number): Promise<Message[]> {
    await this.chatService.findOfUser(chatId, currentUser.id);

    const messages = await this.messageRepository.getByChatId(chatId);

    return messages.sort((a, b) => a.id - b.id);
  }

  public async send(from: User, input: CreateMessageInput): Promise<Message> {
    const chat = await this.chatService.findOfUser(input.chatId, from.id, true);
    const message = await this.messageRepository.save({
      from,
      chat,
      text: input.text,
    });
    const resp = new Message(message.id, message.text, from, chat);

    this.push(chat.users, from, resp);

    return resp;
  }

  private push(users: User[], from: User, message: Message): void {
    users.forEach((user) => {
      if (user.id !== from.id) {
        this.pubSub.publish('messageReceived', {
          messageReceived: message,
          target: user.id,
        });
      }
    });
  }
}
