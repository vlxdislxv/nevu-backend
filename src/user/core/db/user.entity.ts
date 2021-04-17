import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { Chat } from '../../../chat/core/db/chat.entity';
import { BaseEntity } from '../../../common/base/base-entity';
import { Message } from '../../../message/core/db/message.entity';

@Entity()
export class User extends BaseEntity<User> {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Chat, (entity) => entity.users)
  @JoinTable({ name: 'user_chats_chat' })
  chats: Chat[];

  @OneToMany(() => Message, (entity) => entity.from)
  messages: Message[];

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  fullName: string;
}
