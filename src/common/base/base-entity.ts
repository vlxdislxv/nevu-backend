export class BaseEntity<T> {
  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
