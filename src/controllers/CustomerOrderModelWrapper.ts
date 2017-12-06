import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {UpdateOptions} from "sequelize-typescript/node_modules/@types/sequelize";
import {CustomerOrder} from "../models/CustomerOrder";
import {IModelWrapper} from "./IModelWrapper";

export class OrderCustomerModelWrapper implements IModelWrapper<CustomerOrder> {

  public name() {
    return "CustomerOrder";
  }

  public filterColumns(): string[] {
    return ["description"];
  }

  public create(values?: any, options?: ICreateOptions): Promise<CustomerOrder> {
    return CustomerOrder.create(values, options);
  }

  public findAll(options?: IFindOptions): Promise<CustomerOrder[]> {
    return CustomerOrder.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions): Promise<{ rows: CustomerOrder[]; count: number; }> {
    return CustomerOrder.findAndCountAll(options);
  }

  public findById(identifier?: string | number, options?: IFindOptions): Promise<CustomerOrder> {
    return CustomerOrder.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, CustomerOrder[]]> {
    return CustomerOrder.update(values, options);
  }

}
