import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {UpdateOptions} from "sequelize-typescript/node_modules/@types/sequelize";
import {Order} from "../models/Order";
import {IModelWrapper} from "./IModelWrapper";

export class OrderModelWrapper implements IModelWrapper<Order> {

  public name() {
    return "Order";
  }

  public create(values?: any, options?: ICreateOptions): Promise<Order> {
    return Order.create(values, options);
  }

  public findAll(options?: IFindOptions): Promise<Order[]> {
    return Order.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions): Promise<{ rows: Order[]; count: number; }> {
    return Order.findAndCountAll();
  }

  public findById(identifier?: string | number, options?: IFindOptions): Promise<Order> {
    return Order.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, Order[]]> {
    return Order.update(values, options);
  }

}
