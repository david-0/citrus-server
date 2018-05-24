import * as Promise from "bluebird";
import {UpdateOptions} from "sequelize";
import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import {PickupLocation} from "../models/PickupLocation";
import {IModelWrapper} from "./IModelWrapper";

export class PickupLocationModelWrapper implements IModelWrapper<PickupLocation> {

  public name() {
    return "PickupLocation";
  }

  public create(values?: any, options?: ICreateOptions): Promise<PickupLocation> {
    return PickupLocation.create(values, options);
  }

  public findAll(options?: IFindOptions<PickupLocation>): Promise<PickupLocation[]> {
    return PickupLocation.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions<PickupLocation>): Promise<{ rows: PickupLocation[]; count: number; }> {
    return PickupLocation.findAndCountAll();
  }

  public findById(identifier?: string | number, options?: IFindOptions<PickupLocation>): Promise<PickupLocation> {
    return PickupLocation.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, PickupLocation[]]> {
    return PickupLocation.update(values, options);
  }

}
