import * as Promise from "bluebird";
import {CustomerOrderItem} from "../models/CustomerOrderItem";
import {IModelWrapper} from "./IModelWrapper";

export class CustomerOrderItemModelWrapper implements IModelWrapper<CustomerOrderItem> {

  public name() {
    return "CustomerOrderItem";
  }

  public create(value: CustomerOrderItem): Promise<CustomerOrderItem> {
    return CustomerOrderItem.create(value);
  }

  public findAll(): Promise<CustomerOrderItem[]> {
    return CustomerOrderItem.findAll();
  }

  public findAndCountAll(): Promise<{ rows: CustomerOrderItem[]; count: number; }> {
    return CustomerOrderItem.findAndCountAll();
  }

  public findById(identifier?: string | number): Promise<CustomerOrderItem> {
    return CustomerOrderItem.findById(identifier);
  }

  public update(value: CustomerOrderItem): Promise<[number, Array<CustomerOrderItem>]> {
    return CustomerOrderItem.update(value, {where: {id: value.id}});
  }
}
