import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { ChatService } from './chat.service';
import { User } from '../user/core/db/user.entity';
import { Chat } from './core/dto/chat.output';
import { CreateChatInput } from './core/dto/create-chat.input';

@Resolver(() => Chat)
@UseGuards(AuthGuard)
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  @Query(() => [Chat])
  public getChat(@CurrentUser() user: User): Promise<Chat[]> {
    return this.chatService.get(user.id);
  }

  @Mutation(() => Chat)
  public createChat(
    @CurrentUser() user: User,
    @Args('chat') createChatInput: CreateChatInput,
  ): Promise<Chat> {
    return this.chatService.create(user, createChatInput);
  }
}
