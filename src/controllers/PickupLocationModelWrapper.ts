import * as Promise from "bluebird";
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
    return PickupLocation.findAll();
  }

  public findAndCountAll(): Promise<{ rows: PickupLocation[]; count: number; }> {
    return PickupLocation.findAndCountAll();
  }

  public findById(identifier?: string | number): Promise<PickupLocation> {
    return PickupLocation.findById(identifier);
  }

  public update(value: PickupLocation): Promise<[number, Array<PickupLocation>]> {
    return PickupLocation.update(value, {where: {id: value.id}});
  }
}
