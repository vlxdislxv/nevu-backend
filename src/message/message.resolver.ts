import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Subscription } from '@nestjs/graphql';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../user/core/db/user.entity';
import { MessageService } from './message.service';
import { Message } from './core/dto/message.output';
import { CreateMessageInput } from './core/dto/create-message.input';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { getUidFromContext } from '../common/helpers/funcs';
import { IIncomming } from './core/interfaces/incomming.interface';
import { ISubContext } from '../common/interfaces/sub-context.interface';

@Resolver(() => Message)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    private readonly pubSub: RedisPubSub,
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => [Message])
  public getMessage(
    @CurrentUser() user: User,
    @Args('chatId') chatId: number,
  ): Promise<Message[]> {
    return this.messageService.get(user, chatId);
  }

  @Subscription(() => Message, {
    filter: (
      payload: IIncomming,
      variables: Record<string, never>,
      ctx: ISubContext,
    ) => {
      return payload.target === getUidFromContext(ctx);
    },
  })
  public messageReceived() {
    return this.pubSub.asyncIterator('messageReceived');
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Message)
  public addMessage(
    @CurrentUser() user: User,
    @Args('message') createChatInput: CreateMessageInput,
  ): Promise<Message> {
    return this.messageService.send(user, createChatInput);
  }
}
