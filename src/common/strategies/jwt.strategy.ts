import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Env } from '../env';
import { Repository } from 'typeorm';
import { User } from '../../user/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

interface DefaultPayload {
  uid?: number;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Env.JWT_SECRET,
    });
  }

  async validate(payload: DefaultPayload): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ id: payload.uid });
    return user;
  }
}
