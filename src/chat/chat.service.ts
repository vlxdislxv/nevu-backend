import { Injectable, BadRequestException } from '@nestjs/common';
import { GetChatOutput } from './dto/get-chat.output';
import { Chat } from './models/chat.entity';
import { User } from '../user/models/user.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { unique } from '../common/helpers/funcs';
import { UserService } from '../user/user.service';
import { ChatRepository } from './chat.repository';
import { UserRepository } from '../user/user.repository';

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

    return chatsWithMembers.map(
      (chat) =>
        new GetChatOutput(
          chat.id,
          chat.name,
          !!chat.users.find((u) => this.userService.isOnline(u.id)),
        ),
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
