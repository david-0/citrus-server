import * as Promise from "bluebird";
import {Transaction} from "sequelize";
import {Address} from "../models/Address";
import {Location} from "../models/Location";
import {IModelWrapper} from "./IModelWrapper";

export class LocationModelWrapper implements IModelWrapper<Location> {

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
      }],
      transaction,
    });
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: Location[]; count: number; }> {
    return Location.findAndCountAll({
      include: [{
        model: Address,
      }],
      transaction,
    });
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<Location> {
    return Location.findById(identifier, {
      include: [{
        model: Address,
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