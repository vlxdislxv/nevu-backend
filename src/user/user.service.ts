import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterOutput } from './dto/register.output';
import { RegisterInput } from './dto/register.input';
import { User } from './db/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HashHelper } from '../common/module/helpers/hash.helper';
import { LoginInput } from './dto/login.input';
import { LoginOutput } from './dto/login.output';
import { UserFindInput } from './dto/user-find.input';
import { ProfileOutput } from './dto/profile.output';
import { SocketService } from '../socket/socket.service';
import { UserRepository } from './db/user.repository';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly socketService: SocketService,
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

  public isOnline(userId: number): boolean {
    return this.socketService.clientAlive(userId.toString());
  }
}
