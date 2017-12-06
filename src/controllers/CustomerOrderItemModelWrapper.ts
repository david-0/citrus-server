import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {UpdateOptions} from "sequelize-typescript/node_modules/@types/sequelize";
import {CustomerOrderItem} from "../models/CustomerOrderItem";
import {IModelWrapper} from "./IModelWrapper";

export class OrderCustomerItemModelWrapper implements IModelWrapper<CustomerOrderItem> {

  public name() {
    return "CustomerOrderItem";
  }

  public filterColumns(): string[] {
    return ["quantity"];
  }

  public create(values?: any, options?: ICreateOptions): Promise<CustomerOrderItem> {
    return CustomerOrderItem.create(values, options);
  }

  public findAll(options?: IFindOptions): Promise<CustomerOrderItem[]> {
    return CustomerOrderItem.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions): Promise<{ rows: CustomerOrderItem[]; count: number; }> {
    return CustomerOrderItem.findAndCountAll(options);
  }

  public findById(identifier?: string | number, options?: IFindOptions): Promise<CustomerOrderItem> {
    return CustomerOrderItem.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, CustomerOrderItem[]]> {
    return CustomerOrderItem.update(values, options);
  }
}
