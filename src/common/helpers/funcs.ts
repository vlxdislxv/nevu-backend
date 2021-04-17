import { ISubContext } from '../interfaces/sub-context.interface';

export function unique<T>(value: T, index: number, self: Array<T>): boolean {
  return self.indexOf(value) === index;
}

export function getUidFromContext(ctx: ISubContext): number {
  const uid: number = ctx?.req?.user?.id;

  if (!uid) {
    throw new Error('can not get uid');
  }

  return uid;
}
