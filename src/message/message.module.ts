import { MessageService } from './message.service';
import { Module } from '@nestjs/common';
import { MessageResolver } from './message.resolver';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { Env } from '../common/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Message } from './models/message.entity';
import { Chat } from '../chat/models/chat.entity';
import { User } from '../user/models/user.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [
    JwtModule.register({
      secret: Env.JWT_SECRET,
      signOptions: { expiresIn: Env.JWT_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([Message, Chat, User]),
  ],
  providers: [MessageService, MessageResolver, JwtStrategy, Repository],
})
export class MessageModule {}
