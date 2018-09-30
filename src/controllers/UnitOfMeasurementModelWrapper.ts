import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {Transaction} from "sequelize-typescript/node_modules/@types/sequelize";
import {UnitOfMeasurement} from "../models/UnitOfMeasurement";
import {IModelWrapper} from "./IModelWrapper";

export class UnitOfMeasurementModelWrapper implements IModelWrapper<UnitOfMeasurement> {

  public name() {
    return "UnitOfMeasurement";
  }

  public create(value: UnitOfMeasurement, transaction: Transaction): Promise<UnitOfMeasurement> {
    return UnitOfMeasurement.create(value, {transaction});
  }

  public findAll(transaction: Transaction): Promise<UnitOfMeasurement[]> {
    return UnitOfMeasurement.findAll({transaction});
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: UnitOfMeasurement[]; count: number; }> {
    return UnitOfMeasurement.findAndCountAll({transaction});
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<UnitOfMeasurement> {
    return UnitOfMeasurement.findById(identifier, {transaction});
  }

  public update(value: UnitOfMeasurement, transaction: Transaction): Promise<[number, UnitOfMeasurement[]]> {
    return UnitOfMeasurement.update(value, {
      transaction,
      where: {id: value.id},
    });
  }

  public delete(value: UnitOfMeasurement, transaction: Transaction): Promise<void> {
    return value.destroy({transaction});
  }
}
