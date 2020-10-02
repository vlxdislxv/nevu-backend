import { Connection, EntityRepository, Repository } from 'typeorm';
import { Message } from './models/message.entity';

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {
  public getByUserChat(uid: number, chatId: number): Promise<Message[]> {
    return this.createQueryBuilder('message')
      .leftJoin('message.chat', 'chat')
      .leftJoin('chat.users', 'user')
      .leftJoinAndSelect('message.from', 'from')
      .where('user.id = :uid and message.chat = :chatId', { uid, chatId })
      .limit(15)
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
