import { InputType, Field } from '@nestjs/graphql';
import { Length, IsString } from 'class-validator';

@InputType()
export class UserFindInput {
  @Field()
  @Length(1, 20)
  @IsString()
  search: string;
}