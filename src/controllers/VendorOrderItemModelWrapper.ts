import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {UpdateOptions} from "sequelize-typescript/node_modules/@types/sequelize";
import {VendorOrderItem} from "../models/VendorOrderItem";
import {IModelWrapper} from "./IModelWrapper";

export class VendorOrderItemModelWrapper implements IModelWrapper<VendorOrderItem> {

  public name() {
    return "VendorOrderItem";
  }

  public filterColumns(): string[] {
    return ["orderedQuantity", "useableQuantity"];
  }

  public create(values?: any, options?: ICreateOptions): Promise<VendorOrderItem> {
    return VendorOrderItem.create(values, options);
  }

  public findAll(options?: IFindOptions): Promise<VendorOrderItem[]> {
    return VendorOrderItem.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions): Promise<{ rows: VendorOrderItem[]; count: number; }> {
    return VendorOrderItem.findAndCountAll(options);
  }

  public findById(identifier?: string | number, options?: IFindOptions): Promise<VendorOrderItem> {
    return VendorOrderItem.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, VendorOrderItem[]]> {
    return VendorOrderItem.update(values, options);
  }

}
