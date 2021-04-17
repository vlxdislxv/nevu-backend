import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Chat } from './chat.entity';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
  public async findById(chatId: number, thrw = true): Promise<Chat> {
    const chat = await this.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'user')
      .where('chat.id = :chatId', { chatId })
      .getOne();

    if (!chat && thrw) {
      throw new NotFoundException('Chat not found.');
    }

    return chat;
  }

  public findByUserId(uid: number): Promise<Chat[]> {
    return this.createQueryBuilder('chat')
      .leftJoin('chat.users', 'user')
      .where('user.id = :uid', { uid })
      .limit(15)
      .getMany();
  }

  public findByIdAndUserId(
    id: number,
    userId: number,
  ): Promise<Chat | undefined> {
    return this.createQueryBuilder('chat')
      .leftJoin('chat.users', 'users')
      .where({ id })
      .andWhere('users.id = :userId', { userId })
      .getOne();
  }

  public findByIdsWithOtherMembers(
    chatIds: number[],
    except: number,
  ): Promise<Chat[]> {
    return this.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'user')
      .where('user.id != :except and chat.id IN (:...chatIds)', {
        except,
        chatIds,
      })
      .getMany();
  }
}
