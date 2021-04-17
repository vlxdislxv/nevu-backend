import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Subscription } from '@nestjs/graphql';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../user/core/db/user.entity';
import { Message } from './core/db/message.entity';
import { MessageService } from './message.service';
import { GetMessageOutput } from './core/dto/get-message.output';
import { CreateMessageInput } from './core/dto/create-message.input';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { getUidFromContext } from '../common/helpers/funcs';
import { IIncomming } from './core/interfaces/incomming.interface';
import { ISubContext } from '../common/interfaces/sub-context.interface';

@Resolver(() => Message)
@UseGuards(AuthGuard)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    private readonly pubSub: RedisPubSub,
  ) {}

  @Query(() => [GetMessageOutput])
  public getMessage(
    @CurrentUser() user: User,
    @Args('chatId') chatId: number,
  ): Promise<GetMessageOutput[]> {
    return this.messageService.get(user, chatId);
  }

  @Subscription(() => GetMessageOutput, {
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

  @Mutation(() => GetMessageOutput)
  public addMessage(
    @CurrentUser() user: User,
    @Args('message') createChatInput: CreateMessageInput,
  ): Promise<GetMessageOutput> {
    return this.messageService.send(user, createChatInput);
  }
}
