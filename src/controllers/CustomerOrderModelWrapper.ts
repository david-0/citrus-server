import * as Promise from "bluebird";
import {Transaction} from "sequelize";
import {CustomerOrder} from "../models/CustomerOrder";
import {PickupLocation} from "../models/PickupLocation";
import {User} from "../models/User";
import {IModelWrapper} from "./IModelWrapper";

export class CustomerOrderModelWrapper implements IModelWrapper<CustomerOrder> {

  public name() {
    return "CustomerOrder";
  }

  public create(value: CustomerOrder, transaction?: Transaction): Promise<CustomerOrder> {
    return CustomerOrder.create(value, {transaction});
  }

  public findAll(transaction?: Transaction): Promise<CustomerOrder[]> {
    return CustomerOrder.findAll({
      transaction,
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }, {
        model: PickupLocation,
      }],
    });
  }

  public findAndCountAll(transaction?: Transaction): Promise<{ rows: CustomerOrder[]; count: number; }> {
    return CustomerOrder.findAndCountAll({
      transaction,
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }, {
        model: PickupLocation,
      }],
    });
  }

  public findById(identifier?: string | number, transaction?: Transaction): Promise<CustomerOrder> {
    return CustomerOrder.findById(identifier, {
      transaction,
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
