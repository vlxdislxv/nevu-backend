import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { JwtModule } from '@nestjs/jwt';
import { Env } from '../common/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { JwtStrategy } from '../common/strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: Env.JWT_SECRET,
      signOptions: { expiresIn: Env.JWT_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService, UserResolver, JwtStrategy],
  exports: [UserService, JwtModule, JwtStrategy]
})
export class UserModule {}
