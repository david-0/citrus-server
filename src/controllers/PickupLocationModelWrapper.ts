import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {UpdateOptions} from "sequelize-typescript/node_modules/@types/sequelize";
import {PickupLocation} from "../models/PickupLocation";
import {IModelWrapper} from "./IModelWrapper";

export class PickupLocationModelWrapper implements IModelWrapper<PickupLocation> {

  public name() {
    return "PickupLocation";
  }

  public create(values?: any, options?: ICreateOptions): Promise<PickupLocation> {
    return PickupLocation.create(values, options);
  }

  public findAll(options?: IFindOptions): Promise<PickupLocation[]> {
    return PickupLocation.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions): Promise<{ rows: PickupLocation[]; count: number; }> {
    return PickupLocation.findAndCountAll(options);
  }

  public findById(identifier?: string | number, options?: IFindOptions): Promise<PickupLocation> {
    return PickupLocation.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, PickupLocation[]]> {
    return PickupLocation.update(values, options);
  }

}
