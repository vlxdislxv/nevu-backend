import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../common/guards/auth.guard";
import { ChatService } from "./chat.service";
import { User } from "../user/models/user.entity";
import { GetChatOutput } from "./dto/get-chat.output";
import { CreateChatInput } from "./dto/create-chat.input";
import { Chat } from "./models/chat.entity";

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  @Query(() => [GetChatOutput])
  @UseGuards(AuthGuard)
  public getChat(@CurrentUser() user: User): Promise<GetChatOutput[]> {
    return this.chatService.getChats(user.id);
  }

  @Mutation(() => GetChatOutput)
  @UseGuards(AuthGuard)
  public createChat(
    @CurrentUser() user: User,
    @Args('chat') createChatInput: CreateChatInput,
  ): Promise<GetChatOutput> {
    return this.chatService.createChat(user, createChatInput);
  }
}
