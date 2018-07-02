import * as Promise from "bluebird";
import {Transaction} from "sequelize";
import {Address} from "../models/Address";
import {OpeningHour} from "../models/OpeningHour";
import {PickupLocation} from "../models/PickupLocation";
import {IModelWrapper} from "./IModelWrapper";

export class PickupLocationWithOpeningHoursModelWrapper implements IModelWrapper<PickupLocation> {

  public name() {
    return "PickupLocation";
  }

  public create(value: PickupLocation, transaction: Transaction): Promise<PickupLocation> {
    return PickupLocation.create(value, {transaction});
  }

  public findAll(transaction: Transaction): Promise<PickupLocation[]> {
    return PickupLocation.findAll({
      include: [{
        model: Address,
      }, {
        model: OpeningHour,
      }],
      transaction,
    });
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: PickupLocation[]; count: number; }> {
    return PickupLocation.findAndCountAll({
      include: [{
        model: Address,
      }, {
        model: OpeningHour,
      }],
      transaction,
    });
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<PickupLocation> {
    return PickupLocation.findById(identifier, {
      include: [{
        model: Address,
      }, {
        model: OpeningHour,
      }],
      transaction,
    });
  }

  public update(value: PickupLocation, transaction: Transaction): Promise<[number, Array<PickupLocation>]> {
    return PickupLocation.update(value, {
      where: {id: value.id},
      transaction,
    });
  }

  public delete(value: PickupLocation, transaction: Transaction): Promise<void> {
    return value.destroy({transaction});
  }
}
