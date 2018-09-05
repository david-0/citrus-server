import * as Promise from "bluebird";
import {Transaction} from "sequelize";
import {Address} from "../models/Address";
import {OpeningHour} from "../models/OpeningHour";
import {Location} from "../models/Location";
import {IModelWrapper} from "./IModelWrapper";

export class LocationWithOpeningHoursModelWrapper implements IModelWrapper<Location> {

  public name() {
    return "Location";
  }

  public create(value: Location, transaction: Transaction): Promise<Location> {
    return Location.create(value, {transaction});
  }

  public findAll(transaction: Transaction): Promise<Location[]> {
    return Location.findAll({
      include: [{
        model: Address,
      }, {
        model: OpeningHour,
      }],
      transaction,
    });
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: Location[]; count: number; }> {
    return Location.findAndCountAll({
      include: [{
        model: Address,
      }, {
        model: OpeningHour,
      }],
      transaction,
    });
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<Location> {
    return Location.findById(identifier, {
      include: [{
        model: Address,
      }, {
        model: OpeningHour,
      }],
      transaction,
    });
  }

  public update(value: Location, transaction: Transaction): Promise<[number, Array<Location>]> {
    return Location.update(value, {
      where: {id: value.id},
      transaction,
    });
  }

  public delete(value: Location, transaction: Transaction): Promise<void> {
    return value.destroy({transaction});
  }
}
