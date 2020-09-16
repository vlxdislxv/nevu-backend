import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/models/user.entity';
import { Chat } from '../../chat/models/chat.entity';
import { BaseEntity } from '../../common/base/base-entity';
import { SocketService } from '../../socket/socket.service';

@Entity()
export class Message extends BaseEntity<Message> {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  from: User;

  @ManyToOne(() => Chat)
  @JoinColumn()
  chat: Chat;

  @Column()
  text: string;

  constructor(_from: User, _chat: Chat, _text: string) {
    super();

    this.from = _from;
    this.chat = _chat;
    this.text = _text;
  }
}
