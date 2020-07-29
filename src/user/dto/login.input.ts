import { InputType, Field } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @Length(6, 30)
  username: string;

  @Field()
  @Length(6, 30)
  password: string;
}