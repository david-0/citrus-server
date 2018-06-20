import * as Promise from "bluebird";
import {Address} from "../models/Address";
import {CustomerOrder} from "../models/CustomerOrder";
import {PickupLocation} from "../models/PickupLocation";
import {User} from "../models/User";
import {IModelWrapper} from "./IModelWrapper";

export class CustomerOrderModelWrapper implements IModelWrapper<CustomerOrder> {

  public name() {
    return "CustomerOrder";
  }

  public create(value: CustomerOrder): Promise<CustomerOrder> {
    return CustomerOrder.create(value);
  }

  public findAll(): Promise<CustomerOrder[]> {
    return CustomerOrder.findAll({
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }, {
        model: PickupLocation,
      }],
    });
  }

  public findAndCountAll(): Promise<{ rows: CustomerOrder[]; count: number; }> {
    return CustomerOrder.findAndCountAll({
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }, {
        model: PickupLocation,
      }],
    });
  }

  public findById(identifier?: string | number): Promise<CustomerOrder> {
    return CustomerOrder.findById(identifier, {
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }, {
        model: PickupLocation,
      }],
    });
  }

  public update(value: CustomerOrder): Promise<[number, Array<CustomerOrder>]> {
    return CustomerOrder.update(value, {where: {id: value.id}});
  }
}
