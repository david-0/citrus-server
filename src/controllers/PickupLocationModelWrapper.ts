import * as Promise from "bluebird";
import {Address} from "../models/Address";
import {PickupLocation} from "../models/PickupLocation";
import {IModelWrapper} from "./IModelWrapper";

export class PickupLocationModelWrapper implements IModelWrapper<PickupLocation> {

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
      }],
    });
  }

  public findAndCountAll(): Promise<{ rows: PickupLocation[]; count: number; }> {
    return PickupLocation.findAndCountAll({
      include: [{
        model: Address,
      }],
    });
  }

  public findById(identifier?: string | number): Promise<PickupLocation> {
    return PickupLocation.findById(identifier, {
      include: [{
        model: Address,
      }],
    });
  }

  public update(value: PickupLocation): Promise<[number, Array<PickupLocation>]> {
    return PickupLocation.update(value, {where: {id: value.id}});
  }
}
