import * as Promise from "bluebird";
import {Model} from "sequelize-typescript";

export interface IModelWrapper<T extends Model<T>> {

  name(): string;

  create(values: T): Promise<T>;

  findAll(): Promise<T[]>;

  findAndCountAll(): Promise<{ rows: T[], count: number }>;

  findById(identifier?: number | string): Promise<T | null>;

  update(value: T): Promise<[number, Array<T>]>;
}
