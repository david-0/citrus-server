import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {UpdateOptions} from "sequelize-typescript/node_modules/@types/sequelize";
import {VendorOrder} from "../models/VendorOrder";
import {IModelWrapper} from "./IModelWrapper";

export class VendorOrderModelWrapper implements IModelWrapper<VendorOrder> {

  public name() {
    return "VendorOrder";
  }

  public filterColumns(): string[] {
    return ["number", "comment"];
  }

  public create(values?: any, options?: ICreateOptions): Promise<VendorOrder> {
    return VendorOrder.create(values, options);
  }

  public findAll(options?: IFindOptions): Promise<VendorOrder[]> {
    return VendorOrder.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions): Promise<{ rows: VendorOrder[]; count: number; }> {
    return VendorOrder.findAndCountAll(options);
  }

  public findById(identifier?: string | number, options?: IFindOptions): Promise<VendorOrder> {
    return VendorOrder.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, VendorOrder[]]> {
    return VendorOrder.update(values, options);
  }

}
