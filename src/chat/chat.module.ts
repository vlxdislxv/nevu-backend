import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Env } from '../common/env';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../message/models/message.entity';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { Chat } from './models/chat.entity';
import { User } from '../user/models/user.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: Env.JWT_SECRET,
      signOptions: { expiresIn: Env.JWT_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([Message, Chat, User]),
  ],
  providers: [ChatService, ChatResolver, JwtStrategy, Repository],
})
export class ChatModule {}
