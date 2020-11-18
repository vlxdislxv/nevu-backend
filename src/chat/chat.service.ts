import { Injectable, BadRequestException } from '@nestjs/common';
import { GetChatOutput } from './dto/get-chat.output';
import { Chat } from './db/chat.entity';
import { User } from '../user/db/user.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { unique } from '../common/helpers/funcs';
import { UserService } from '../user/user.service';
import { ChatRepository } from './db/chat.repository';
import { UserRepository } from '../user/db/user.repository';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ChatService {
  public constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  public async get(uid: number): Promise<GetChatOutput[]> {
    const chats = await this.chatRepository.findByUserId(uid);

    const chatIds = [-1, ...chats.map(chat => chat.id)];

    const chatsWithMembers = await this.chatRepository.findByIdsWithOtherMembers(chatIds, uid);

    return chatsWithMembers.map((chat) =>
      plainToClass(GetChatOutput, {
        ...chat,
        online: chat.users.some((u) => this.userService.isOnline(u.id)),
      }),
    );
  }

  public async create(currUser: User, createChat: CreateChatInput): Promise<GetChatOutput> {
    const ids = [...createChat.with, currUser.id].filter(unique);

    if (ids.length <= 1) {
      throw new BadRequestException('with[] is invalid');
    }

    const users = await this.userRepository.findByIds(ids);

    if (users.length !== ids.length) {
      throw new BadRequestException('with[] is invalid');
    }

    return this.chatRepository.save({ users, name: this.generateChatName(users)})
  }

  private generateChatName(users: User[]): string {
    let chatName = '';
    users.map(user => {chatName += `${user.fullName},`});
    chatName = chatName.substring(0, chatName.length - 1);
    return chatName;
  }

  public hasUserWithId(chat: Chat, userId: number): boolean {
    return chat.users.some(u => u.id === userId);
  }
}
