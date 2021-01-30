import { InputType, Field } from '@nestjs/graphql';
import { Length, IsEmail, Validate } from 'class-validator';
import { EmailUnique } from '../../common/decorators/email-unique.decorator';
import { UsernameUnique } from '../../common/decorators/username-unique.decorator';

@InputType()
export class RegisterInput {
  @Field()
  fullName: string;

  @Field()
  @IsEmail()
  @Validate(EmailUnique)
  email: string;

  @Field()
  @Length(6, 30)
  @Validate(UsernameUnique)
  username: string;

  @Field()
  @Length(6, 30)
  password: string;
}
