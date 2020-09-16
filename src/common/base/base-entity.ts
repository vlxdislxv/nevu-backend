export interface IRepository<T> {
  save: (T) => T | Promise<T>;
}

export class BaseEntity<T> {
  public save(repository: IRepository<T>): Promise<T> | T {
    return repository.save(this);
  }
}
