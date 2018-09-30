import {Model} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {Transaction} from "sequelize-typescript/node_modules/@types/sequelize";

export interface IModelWrapper<T extends Model<T>> {

  name(): string;

  create(values: T, transaction: Transaction): Promise<T>;

  findAll(transaction: Transaction): Promise<T[]>;

  findAndCountAll(transaction: Transaction): Promise<{ rows: T[], count: number }>;

  findById(identifier: number | string, transaction: Transaction): Promise<T | null>;

  update(value: T, transaction: Transaction): Promise<[number, Array<T>]>;

  delete(value: T, transaction: Transaction): Promise<void>;
}
