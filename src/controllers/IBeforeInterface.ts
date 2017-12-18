import {Model} from "sequelize-typescript";

export interface IBeforeUpdate<T extends Model<T>> {
  beforeUpdate(instance: T): void;
}
