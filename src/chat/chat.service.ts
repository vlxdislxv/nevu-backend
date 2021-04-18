import { Injectable, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Chat as ChatEntity } from './core/db/chat.entity';
import { Chat } from './core/dto/chat.output';
import { User } from '../user/core/db/user.entity';
import { CreateChatInput } from './core/dto/create-chat.input';
import { unique } from '../common/helpers/funcs';
import { UserService } from '../user/user.service';
import { ChatRepository } from './core/db/chat.repository';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class ChatService {
  public constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userService: UserService,
    private readonly subService: SubscriptionService,
  ) {}

  public async get(uid: number): Promise<Chat[]> {
    const chats = await this.chatRepository.findByUserId(uid);

    const chatIds = [-1, ...chats.map((chat) => chat.id)];

    const chatsWithMembers = await this.chatRepository.findByIdsWithOtherMembers(
      chatIds,
      uid,
    );

    return chatsWithMembers.map((chat) =>
      plainToClass(Chat, {
        ...chat,
        online: chat.users.some((u) => this.subService.isOnline(u.id)),
      }),
    );
  }

  public async create(
    currUser: User,
    createChat: CreateChatInput,
  ): Promise<Chat> {
    const ids = [...createChat.with, currUser.id].filter(unique);

    if (ids.length <= 1) {
      throw new BadRequestException('with[] is invalid');
    }

    const users = await this.userService.findByIds(ids);

    if (users.length !== ids.length) {
      throw new BadRequestException('with[] is invalid');
    }

    return this.chatRepository.save({
      users,
      name: this.generateChatName(users),
    });
  }

  public async findOfUser(
    chatId: number,
    userId: number,
    withOthers = false,
  ): Promise<ChatEntity> {
    let chat: ChatEntity = null;

    if (withOthers) {
      chat = await this.chatRepository.findById(chatId);
    } else {
      chat = await this.chatRepository.findByIdAndUserId(chatId, userId);
    }

    if (!chat || !chat.users.some((user) => user.id === userId)) {
      throw new BadRequestException('chat not found');
    }

    return chat;
  }

  private generateChatName(users: User[]): string {
    let chatName = '';
    users.forEach((user) => {
      chatName += `${user.fullName},`;
    });
    chatName = chatName.substring(0, chatName.length - 1);
    return chatName;
  }
}
