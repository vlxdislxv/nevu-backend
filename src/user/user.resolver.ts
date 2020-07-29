import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { User } from "./models/user.entity";
import { RegisterInput } from "./dto/register.input";
import { RegisterOutput } from "./dto/register.output";
import { UserService } from "./user.service";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { ProfileOutput } from "./dto/profile.output";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../common/guards/auth.guard";
import { LoginOutput } from "./dto/login.output";
import { LoginInput } from "./dto/login.input";

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => ProfileOutput)
  @UseGuards(AuthGuard)
  async profile(@CurrentUser() user: User): Promise<ProfileOutput> {
    return user;
  }

  @Mutation(() => RegisterOutput)
  async register(@Args('user') regData: RegisterInput): Promise<RegisterOutput> {
    return this.userService.register(regData);
  }  
  
  @Mutation(() => LoginOutput)
  async login(@Args('user') loginData: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginData);
  }
}