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

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly socketService: SocketService,
  ) {}

  public async register(input: RegisterInput): Promise<RegisterOutput> {
    const user = await this.usersRepository.save({
      ...input,
      password: await HashHelper.bcrypt(input.password),
    });
    return { token: await this.jwtService.signAsync({ uid: user.id }) };
  }

  public async login(input: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.usersRepository.findOneOrFail({
        ...input,
        password: await HashHelper.bcrypt(input.password),
      });
      return { token: await this.jwtService.signAsync({ uid: user.id }) };
    } catch {
      throw new UnauthorizedException();
    }
  }

  public find(input: UserFindInput, currUser: User): Promise<ProfileOutput[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.fullName LIKE :fullName and id != :uid', {
        fullName: `%${input.search}%`,
        uid: currUser.id,
      })
      .getMany();
  }

  public findById(id: number): Promise<User> {
    return this.usersRepository.findOne({ id });
  }

  public findByIds(ids: number[]): Promise<User[]> {
    return this.usersRepository.findByIds(ids);
  }

  public isOnline(userId: number): boolean {
    return this.socketService.clientAlive(userId.toString());
  }
}
