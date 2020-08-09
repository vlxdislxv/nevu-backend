import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class ProfileOutput {
  @Field()
  id: number;

  @Field()
  username: string;

  @Field()
  fullName: string;
}