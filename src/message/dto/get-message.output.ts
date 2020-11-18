import { Field, ObjectType } from '@nestjs/graphql';
import { ProfileOutput } from '../../user/dto/profile.output';
import { GetChatOutput } from '../../chat/dto/get-chat.output';
import { User } from '../../user/db/user.entity';
import { Chat } from '../../chat/db/chat.entity';

@ObjectType()
export class GetMessageOutput {
  @Field()
  id: number;

  @Field()
  text: string;

  @Field(() => ProfileOutput)
  from: ProfileOutput;

  @Field(() => GetChatOutput)
  chat: GetChatOutput;

  constructor(_id: number, _text: string, _from: User, _chat: Chat) {
    this.id = _id;
    this.text = _text;
    this.from = {
      id: _from.id,
      username: _from.username,
      fullName: _from.fullName,
    };
    this.chat = {
      id: _chat.id,
      name: _chat.name,
    };
  }
}
