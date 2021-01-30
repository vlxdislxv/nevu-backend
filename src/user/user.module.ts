import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { SocketModule } from '../socket/socket.module';
import { UserRepositoryProvider } from './db/user.repository';
import { EmailUnique } from '../common/decorators/email-unique.decorator';
import { UsernameUnique } from '../common/decorators/username-unique.decorator';
import { ConfigService } from 'src/config/config.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
        };
      },
      inject: [ConfigService],
    }),
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
