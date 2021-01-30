import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  Column,
} from 'typeorm';
import { User } from '../../user/db/user.entity';
import { Message } from '../../message/db/message.entity';
import { BaseEntity } from '../../common/base/base-entity';

@Entity()
export class Chat extends BaseEntity<Chat> {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  @JoinTable({ name: 'user_chats_chat' })
  users: User[];

  @OneToMany(() => Message, (message) => message.chat)
  @JoinColumn()
  messages: Message[];

  @Column()
  name: string;
}
