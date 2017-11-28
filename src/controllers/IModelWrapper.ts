import {ICreateOptions, IFindOptions, Model} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {UpdateOptions} from "sequelize-typescript/node_modules/@types/sequelize";

export interface IModelWrapper<T extends Model<T>> {

  name(): string;

  filterColumns(): string[];

  create(values?: any, options?: ICreateOptions): Promise<T>;

  findAll(options?: IFindOptions): Promise<T[]>;

  findAndCountAll(options?: IFindOptions): Promise<{ rows: T[], count: number }>;

  findById(identifier?: number | string, options?: IFindOptions): Promise<T | null>;

  update(values: any, options: UpdateOptions): Promise<[number, Array<T>]>;
}
