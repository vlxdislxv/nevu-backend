import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../../user/core/db/user.entity';
import { Chat } from '../../../chat/core/db/chat.entity';
import { BaseEntity } from '../../../common/base/base-entity';

@Entity()
export class Message extends BaseEntity<Message> {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (entity) => entity.messages)
  from: User;

  @ManyToOne(() => Chat, (entity) => entity.messages)
  chat: Chat;

  @Column()
  text: string;
}
