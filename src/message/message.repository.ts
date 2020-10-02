import { Connection, EntityRepository, Repository } from 'typeorm';
import { Message } from './models/message.entity';

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {
  public getByChatId(chatId: number): Promise<Message[]> {
    return this.createQueryBuilder('message')
      .leftJoinAndSelect('message.from', 'from')
      .where('message.chat = :chatId', { chatId })
      .take(15)
      .orderBy('message.id', 'DESC')
      .getMany();
  }
}

export const MessageRepositoryProvider = {
  provide: 'MessageRepository',
  useFactory: (connection: Connection): MessageRepository =>
    connection.getCustomRepository(MessageRepository),
  inject: [Connection],
};
