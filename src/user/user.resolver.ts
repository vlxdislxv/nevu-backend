import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from './db/user.entity';
import { RegisterInput } from './dto/register.input';
import { RegisterOutput } from './dto/register.output';
import { UserService } from './user.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProfileOutput } from './dto/profile.output';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { LoginOutput } from './dto/login.output';
import { LoginInput } from './dto/login.input';
import { UserFindInput } from './dto/user-find.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => ProfileOutput)
  @UseGuards(AuthGuard)
  async profile(@CurrentUser() user: User): Promise<ProfileOutput> {
    return user;
  }

  @Query(() => [ProfileOutput])
  @UseGuards(AuthGuard)
  public findUser(
    @CurrentUser() user: User,
    @Args('user') userFindInput: UserFindInput,
  ): Promise<ProfileOutput[]> {
    return this.userService.find(userFindInput, user);
  }

  @Mutation(() => RegisterOutput)
  public register(
    @Args('user') regData: RegisterInput,
  ): Promise<RegisterOutput> {
    return this.userService.register(regData);
  }

  @Mutation(() => LoginOutput)
  public login(@Args('user') loginData: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginData);
  }
}
