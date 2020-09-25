// export interface IRepository<T> {
//   save: (T) => T | Promise<T>;
// }

export class BaseEntity<T> {
  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }

  // public save(repository: IRepository<T>): Promise<T> | T {
  //   return repository.save(this);
  // }
}
