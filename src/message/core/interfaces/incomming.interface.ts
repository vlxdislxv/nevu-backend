import { GetMessageOutput } from '../dto/get-message.output';

export interface IIncomming {
  messageReceived: GetMessageOutput;
  target: number;
}
