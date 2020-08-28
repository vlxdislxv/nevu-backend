import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  Column,
} from 'typeorm';
import { User } from '../../user/models/user.entity';
import { Message } from '../../message/models/message.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  @JoinTable({ name: 'user_chats_chat' })
  users: User[];

  @OneToMany(() => Message, message => message.chat)
  @JoinColumn()
  messages: Message[];

  @Column()
  name: string;

  online?: boolean;
}
