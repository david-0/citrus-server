import * as Promise from "bluebird";
import {Transaction} from "sequelize";
import {Model} from "sequelize-typescript";

export interface IModelWrapper<T extends Model<T>> {

  name(): string;

  create(values: T, transaction: Transaction): Promise<T>;

  findAll(transaction: Transaction): Promise<T[]>;

  findAndCountAll(transaction: Transaction): Promise<{ rows: T[], count: number }>;

  findById(identifier: number | string, transaction: Transaction): Promise<T | null>;

  update(value: T, transaction: Transaction): Promise<[number, Array<T>]>;
}
