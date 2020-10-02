import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterOutput } from './dto/register.output';
import { RegisterInput } from './dto/register.input';
import { User } from './models/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { HashHelper } from '../common/helpers/hash.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginInput } from './dto/login.input';
import { LoginOutput } from './dto/login.output';
import { UserFindInput } from './dto/user-find.input';
import { ProfileOutput } from './dto/profile.output';
import { SocketService } from '../socket/socket.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly socketService: SocketService,
  ) {}

  public async register(input: RegisterInput): Promise<RegisterOutput> {
    const user = await this.userRepository.save(this.userRepository.create(input));

    return { token: await this.jwtService.signAsync({ uid: user.id }) };
  }

  public async login(input: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.userRepository.findOneOrFail({
        ...input,
        password: await HashHelper.bcrypt(input.password),
      });
      return { token: await this.jwtService.signAsync({ uid: user.id }) };
    } catch {
      throw new UnauthorizedException();
    }
  }

  public find(input: UserFindInput, currUser: User): Promise<ProfileOutput[]> {
    return this.userRepository.search(input.search, currUser.id);
  }

  public isOnline(userId: number): boolean {
    return this.socketService.clientAlive(userId.toString());
  }
}
