import { Field, ObjectType } from '@nestjs/graphql';
import { ProfileOutput } from '../../user/dto/profile.output';
import { GetChatOutput } from '../../chat/dto/get-chat.output';

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
}