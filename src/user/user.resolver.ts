import { Resolver, Query, Args, Mutation, Field, ObjectType } from "@nestjs/graphql";
import { User } from "./models/user.entity";
import { RegisterInput } from "./dto/register.input";
import { JwtService } from "@nestjs/jwt";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../common/guards/auth.guard";

@Resolver(() => User)
export class UserResolver {
  constructor(private jwtService: JwtService) {}
  @Query(() => String)
  async profile(): Promise<string> {
    return 'test';
  }

  // @Mutation(() => obj)
  // async register(@Args('user') regData: RegisterInput): Promise<obj> {
  //   console.log(regData);
  //   return { token: await this.jwtService.signAsync(regData) };
  // }

  // @UseGuards(AuthGuard)
  // @Query(() => auth)
  // async auth(): Promise<auth> {
  //   return { status: true };
  // }
}