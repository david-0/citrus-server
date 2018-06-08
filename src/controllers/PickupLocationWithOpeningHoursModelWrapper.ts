import * as Promise from "bluebird";
import {Address} from "../models/Address";
import {OpeningHour} from "../models/OpeningHour";
import {PickupLocation} from "../models/PickupLocation";
import {IModelWrapper} from "./IModelWrapper";

export class PickupLocationWithOpeningHoursModelWrapper implements IModelWrapper<PickupLocation> {

  public name() {
    return "PickupLocation";
  }

  public create(value: PickupLocation): Promise<PickupLocation> {
    return PickupLocation.create(value);
  }

  public findAll(): Promise<PickupLocation[]> {
    return PickupLocation.findAll({
      include: [{
        model: Address,
      }, {
        model: OpeningHour,
      }],
    });
  }

  public findAndCountAll(): Promise<{ rows: PickupLocation[]; count: number; }> {
    return PickupLocation.findAndCountAll({
      include: [{
        model: Address,
      }, {
        model: OpeningHour,
      }],
    });
  }

  public findById(identifier?: string | number): Promise<PickupLocation> {
    return PickupLocation.findById(identifier, {
      include: [{
        model: Address,
      }, {
        model: OpeningHour,
      }],
    });
  }

  public update(value: PickupLocation): Promise<[number, Array<PickupLocation>]> {
    return PickupLocation.update(value, {where: {id: value.id}});
  }
}
