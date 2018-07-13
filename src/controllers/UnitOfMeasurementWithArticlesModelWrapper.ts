import * as Promise from "bluebird";
import {Transaction} from "sequelize";
import {Article} from "../models/Article";
import {UnitOfMeasurement} from "../models/UnitOfMeasurement";
import {IModelWrapper} from "./IModelWrapper";

export class UnitOfMeasurementWithArticlesModelWrapper implements IModelWrapper<UnitOfMeasurement> {

  public name() {
    return "UnitOfMeasurement";
  }

  public create(value: UnitOfMeasurement, transaction: Transaction): Promise<UnitOfMeasurement> {
    return UnitOfMeasurement.create(value, {transaction});
  }

  public findAll(transaction: Transaction): Promise<UnitOfMeasurement[]> {
    return UnitOfMeasurement.findAll({
      include: [Article],
      transaction
    });
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: UnitOfMeasurement[]; count: number; }> {
    return UnitOfMeasurement.findAndCountAll({
      include: [Article],
      transaction
    });
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<UnitOfMeasurement> {
    return UnitOfMeasurement.findById(identifier, {
      include: [Article],
      transaction
    });
  }

  public update(value: UnitOfMeasurement, transaction: Transaction): Promise<[number, UnitOfMeasurement[]]> {
    return UnitOfMeasurement.update(value, {
      where: {id: value.id},
      transaction,
    });
  }

  public delete(value: UnitOfMeasurement, transaction: Transaction): Promise<void> {
    return value.destroy({transaction});
  }
}
