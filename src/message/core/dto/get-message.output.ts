import { Field, ObjectType } from '@nestjs/graphql';
import { ProfileOutput } from '../../../user/core/dto/profile.output';
import { User } from '../../../user/core/db/user.entity';

@ObjectType()
export class GetMessageOutput {
  @Field()
  id: number;

  @Field()
  text: string;

  @Field(() => ProfileOutput)
  from: ProfileOutput;

  constructor(_id: number, _text: string, _from: User) {
    this.id = _id;
    this.text = _text;
    this.from = {
      id: _from.id,
      username: _from.username,
      fullName: _from.fullName,
    };
  }
}
