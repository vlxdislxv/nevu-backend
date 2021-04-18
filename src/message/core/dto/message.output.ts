import { Field, ObjectType } from '@nestjs/graphql';
import { ProfileOutput } from '../../../user/core/dto/profile.output';
import { User } from '../../../user/core/db/user.entity';
import { Chat } from '../../../chat/core/dto/chat.output';
import { Chat as ChatEntity } from '../../../chat/core/db/chat.entity';

@ObjectType()
export class Message {
  @Field()
  id: number;

  @Field()
  text: string;

  @Field(() => ProfileOutput)
  from: ProfileOutput;

  @Field(() => Chat)
  chat: Chat;

  constructor(_id: number, _text: string, _from: User, _chat: ChatEntity) {
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
      online: true,
    };
  }
}
