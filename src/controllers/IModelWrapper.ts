import * as Promise from "bluebird";
import {UpdateOptions} from "sequelize";
import {ICreateOptions, IFindOptions, Model} from "sequelize-typescript";

export interface IModelWrapper<T extends Model<T>> {

  name(): string;

  create(values?: any, options?: ICreateOptions): Promise<T>;

  findAll(options?: IFindOptions<T>): Promise<T[]>;

  findAndCountAll(options?: IFindOptions<T>): Promise<{ rows: T[], count: number }>;

  findById(identifier?: number | string, options?: IFindOptions<T>): Promise<T | null>;

  update(values: any, options: UpdateOptions): Promise<[number, Array<T>]>;
}
