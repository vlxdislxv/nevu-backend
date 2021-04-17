import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { EmailUnique } from '../common/decorators/email-unique.decorator';
import { UsernameUnique } from '../common/decorators/username-unique.decorator';
import { UserRepository } from './core/db/user.repository';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.registerAsync({
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    UserService,
    JwtStrategy,
    EmailUnique,
    UserResolver,
    UsernameUnique,
  ],
  exports: [UserService, JwtModule, JwtStrategy],
})
export class UserModule {}
