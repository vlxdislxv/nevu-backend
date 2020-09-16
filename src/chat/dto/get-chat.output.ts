import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetChatOutput {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  online?: boolean;

  constructor(_id: number, _name: string, _online?: boolean) {
    this.id = _id;
    this.name = _name;
    this.online = _online;
  }
}