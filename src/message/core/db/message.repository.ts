import { EntityRepository, Repository } from 'typeorm';
import { Message } from './message.entity';

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
