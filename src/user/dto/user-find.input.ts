import { InputType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { Length, IsString } from 'class-validator';

@InputType()
export class UserFindInput {
  @Field()
  @Length(1, 20)
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  search: string;
}
