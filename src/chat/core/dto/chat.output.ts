import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class Chat {
  @Expose()
  @Field()
  id: number;

  @Expose()
  @Field()
  name: string;

  @Expose()
  @Field()
  online?: boolean;
}
