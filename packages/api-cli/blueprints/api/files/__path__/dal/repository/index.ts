export interface IRepository<T> extends ICommand, IQuery { }

export interface ICommand {
    save(doc: any): Promise<any>
    delete(id: string): Promise<Boolean>,
    update(id: string, json: {}): Promise<Boolean>,
    patch(id: string, json: {}): Promise<Boolean>
}

interface IQuery {
    findById<T>(id: string): Promise<T>,
    getAll<T>(): Promise<[T]>,
    find<T>(json: {}): Promise<[T]>,
    findOne<T>(json: {}): Promise<T>
}