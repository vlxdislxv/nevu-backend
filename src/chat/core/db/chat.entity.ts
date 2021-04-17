import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../user/core/db/user.entity';
import { Message } from '../../../message/core/db/message.entity';
import { BaseEntity } from '../../../common/base/base-entity';

@Entity()
export class Chat extends BaseEntity<Chat> {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, (entity) => entity.chats, { cascade: true })
  @JoinTable({ name: 'user_chats_chat' })
  users: User[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @Column()
  name: string;
}
