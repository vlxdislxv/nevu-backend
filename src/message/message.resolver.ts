import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../common/guards/auth.guard";
import { User } from "../user/models/user.entity";
import { Message } from "./models/message.entity";
import { MessageService } from "./message.service";
import { GetMessageOutput } from "./dto/get-message.output";
import { CreateMessageInput } from "./dto/create-message.input";

@Resolver(() => Message)
export class MessageResolver {
  constructor(private messageService: MessageService) {}

  @Query(() => [GetMessageOutput])
  @UseGuards(AuthGuard)
  async getMessage(
    @CurrentUser() user: User,
    @Args('chatId') chatId: number,
  ): Promise<GetMessageOutput[]> {
    return this.messageService.getMessages(user.id, chatId);
  }

  @Mutation(() => GetMessageOutput)
  @UseGuards(AuthGuard)
  async addMessage(
    @CurrentUser() user: User,
    @Args('message') createChatInput: CreateMessageInput,
  ): Promise<GetMessageOutput> {
    return this.messageService.sendMessage(user, createChatInput);
  }
}
