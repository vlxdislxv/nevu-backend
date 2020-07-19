import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { User } from "./models/user.entity";
import { RegisterInput } from "./dto/register.input";
import { Body, BadRequestException } from "@nestjs/common";

@Resolver(of => User)
export class UserResolver {
  @Query(returns => String)
  async profile(): Promise<string> {
    return 'test';
  }

  @Mutation(returns => String)
  async register(@Args('user') regData: RegisterInput): Promise<string> {
    console.log(regData);
    return 'test';
  }
}