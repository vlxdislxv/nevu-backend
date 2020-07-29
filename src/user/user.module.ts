import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { JwtModule } from '@nestjs/jwt';
import { Env } from '../common/env';
import { JwtStrategy } from '../common/strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: Env.JWT_SECRET,
      signOptions: { expiresIn: Env.JWT_EXPIRES_IN }
    })
  ],
  providers: [UserResolver, JwtStrategy]
})
export class UserModule {}
