import { Message } from '../dto/message.output';

export interface IIncomming {
  messageReceived: Message;
  target: number;
}
