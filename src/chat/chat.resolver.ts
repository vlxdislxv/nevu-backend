import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { ChatService } from './chat.service';
import { User } from '../user/core/db/user.entity';
import { GetChatOutput } from './core/dto/get-chat.output';
import { CreateChatInput } from './core/dto/create-chat.input';
import { Chat } from './core/db/chat.entity';

@Resolver(() => Chat)
@UseGuards(AuthGuard)
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  @Query(() => [GetChatOutput])
  public getChat(@CurrentUser() user: User): Promise<GetChatOutput[]> {
    return this.chatService.get(user.id);
  }

  @Mutation(() => GetChatOutput)
  public createChat(
    @CurrentUser() user: User,
    @Args('chat') createChatInput: CreateChatInput,
  ): Promise<GetChatOutput> {
    return this.chatService.create(user, createChatInput);
  }
}
