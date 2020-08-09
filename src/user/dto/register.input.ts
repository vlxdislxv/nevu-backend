import { InputType, Field } from '@nestjs/graphql';
import { Length, IsEmail } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  fullName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(6, 30)
  username: string;

  @Field()
  @Length(6, 30)
  password: string;
}