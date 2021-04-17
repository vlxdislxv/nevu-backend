import { InputType, Field, Int } from '@nestjs/graphql';
import { ArrayMinSize, ArrayMaxSize } from 'class-validator';

@InputType()
export class CreateChatInput {
  @Field(() => [Int])
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  with: number[];
}
