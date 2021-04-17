import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../user/core/db/user.entity';
import { Message } from './core/db/message.entity';
import { MessageService } from './message.service';
import { GetMessageOutput } from './core/dto/get-message.output';
import { CreateMessageInput } from './core/dto/create-message.input';

@Resolver(() => Message)
@UseGuards(AuthGuard)
export class MessageResolver {
  constructor(private messageService: MessageService) {}

  @Query(() => [GetMessageOutput])
  public getMessage(
    @CurrentUser() user: User,
    @Args('chatId') chatId: number,
  ): Promise<GetMessageOutput[]> {
    return this.messageService.get(user, chatId);
  }

  @Mutation(() => GetMessageOutput)
  public addMessage(
    @CurrentUser() user: User,
    @Args('message') createChatInput: CreateMessageInput,
  ): Promise<GetMessageOutput> {
    return this.messageService.send(user, createChatInput);
  }
}
