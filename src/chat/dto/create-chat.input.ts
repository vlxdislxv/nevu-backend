import { InputType, Field, Int } from '@nestjs/graphql';
import { User } from '../../user/models/user.entity';

@InputType()
export class CreateChatInput {
  @Field(() => [Int])
  with: User[];
}