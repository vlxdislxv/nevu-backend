import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { JwtModule } from '@nestjs/jwt';
import { Env } from '../common/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './db/user.entity';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { SocketModule } from '../socket/socket.module';
import { UserRepositoryProvider } from './db/user.repository';
import { EmailUnique } from '../common/decorators/email-unique.decorator';
import { UsernameUnique } from '../common/decorators/username-unique.decorator';

@Module({
  imports: [
    JwtModule.register({
      secret: Env.JWT_SECRET,
      signOptions: { expiresIn: Env.JWT_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([User]),
    SocketModule,
  ],
  providers: [
    UserService,
    UserResolver,
    JwtStrategy,
    UserRepositoryProvider,
    UsernameUnique,
    EmailUnique,
  ],
  exports: [UserService, JwtModule, JwtStrategy, UserRepositoryProvider],
})
export class UserModule {}
