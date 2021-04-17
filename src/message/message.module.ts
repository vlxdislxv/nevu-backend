import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { ChatModule } from '../chat/chat.module';
import { MessageRepository } from './core/db/message.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MessageRepository]), ChatModule],
  providers: [MessageService, MessageResolver],
})
export class MessageModule {}
