import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterOutput } from './core/dto/register.output';
import { RegisterInput } from './core/dto/register.input';
import { User } from './core/db/user.entity';
import { HashHelper } from '../common/module/helpers/hash.helper';
import { LoginInput } from './core/dto/login.input';
import { LoginOutput } from './core/dto/login.output';
import { UserFindInput } from './core/dto/user-find.input';
import { ProfileOutput } from './core/dto/profile.output';
import { UserRepository } from './core/db/user.repository';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly hashHelper: HashHelper,
  ) {}

  public async register(input: RegisterInput): Promise<RegisterOutput> {
    const user = await this.userRepository.save(
      this.userRepository.create({
        ...input,
        password: await this.hashHelper.bcrypt(input.password),
      }),
    );

    return { token: await this.jwtService.signAsync({ uid: user.id }) };
  }

  public async login(input: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.userRepository.findOneOrFail({
        username: input.username,
      });

      if (user.password === (await this.hashHelper.bcrypt(input.password))) {
        return { token: await this.jwtService.signAsync({ uid: user.id }) };
      }
    } catch {}

    throw new UnauthorizedException();
  }

  public find(input: UserFindInput, currUser: User): Promise<ProfileOutput[]> {
    return this.userRepository.search(input.search, currUser.id);
  }

  public findByIds(ids: number[]): Promise<User[]> {
    return this.userRepository.findByIds(ids);
  }

  public isOnline(userId: number): boolean {
    return true;
  }
}
