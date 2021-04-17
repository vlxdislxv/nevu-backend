import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../user/core/db/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from 'src/config/config.service';

interface DefaultPayload {
  uid?: number;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: DefaultPayload): Promise<User | undefined> {
    return this.usersRepository.findOne({ id: payload.uid });
  }
}
