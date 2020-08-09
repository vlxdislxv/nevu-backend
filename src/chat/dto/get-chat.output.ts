import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetChatOutput {
  @Field()
  id: number;

  @Field()
  name: string;
}