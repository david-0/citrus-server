import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {Transaction} from "sequelize-typescript/node_modules/@types/sequelize";
import {OpeningHour} from "../models/OpeningHour";
import {IModelWrapper} from "./IModelWrapper";

export class OpeningHourModelWrapper implements IModelWrapper<OpeningHour> {

  public name() {
    return "OpeningHour";
  }

  public create(values: OpeningHour, transaction: Transaction): Promise<OpeningHour> {
    return OpeningHour.create(values, {transaction});
  }

  public findAll(transaction: Transaction): Promise<OpeningHour[]> {
    return OpeningHour.findAll({transaction});
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: OpeningHour[]; count: number; }> {
    return OpeningHour.findAndCountAll({transaction});
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<OpeningHour> {
    return OpeningHour.findById(identifier, {transaction});
  }

  public update(value: OpeningHour, transaction: Transaction): Promise<[number, OpeningHour[]]> {
    return OpeningHour.update(value, {
      transaction,
      where: {id: value.id},
    });
  }

  public delete(value: OpeningHour, transaction: Transaction): Promise<void> {
    return value.destroy({transaction});
  }
}
