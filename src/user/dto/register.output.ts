import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class RegisterOutput {
  @Field()
  token: string;
}