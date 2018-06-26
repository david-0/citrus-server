import * as Promise from "bluebird";
import {Transaction} from "sequelize";
import {Address} from "../models/Address";
import {Article} from "../models/Article";
import {CustomerOrder} from "../models/CustomerOrder";
import {CustomerOrderItem} from "../models/CustomerOrderItem";
import {PickupLocation} from "../models/PickupLocation";
import {UnitOfMeasurement} from "../models/UnitOfMeasurement";
import {User} from "../models/User";
import {IModelWrapper} from "./IModelWrapper";

export class CustomerOrderWithItemsAndArticleModelWrapper implements IModelWrapper<CustomerOrder> {

  public name() {
    return "CustomerOrder";
  }

  public create(value: CustomerOrder, transaction: Transaction): Promise<CustomerOrder> {
    return CustomerOrder.create(value, {transaction});
  }

  public findAll(transaction: Transaction): Promise<CustomerOrder[]> {
    return CustomerOrder.findAll({
      include: [{
        model: CustomerOrderItem,
        include: [{
          model: Article,
          include: [UnitOfMeasurement],
        }],
      }, {
        attributes: {exclude: ["password"]},
        model: User,
      }, {
        model: PickupLocation,
        include: [{
          model: Address,
        }],
      }],
      transaction,
    });
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: CustomerOrder[]; count: number; }> {
    return CustomerOrder.findAndCountAll({
      include: [{
        model: CustomerOrderItem,
        include: [{
          model: Article,
          include: [UnitOfMeasurement],
        }],
      }, {
        attributes: {exclude: ["password"]},
        model: User,
      }, {
        model: PickupLocation,
        include: [{
          model: Address,
        }],
      }],
      transaction,
    });
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<CustomerOrder> {
    return CustomerOrder.findById(identifier, {
      transaction,
      include: [{
        model: CustomerOrderItem,
        include: [{
          model: Article,
          include: [UnitOfMeasurement],
        }],
      }, {
        attributes: {exclude: ["password"]},
        model: User,
      }, {
        model: PickupLocation,
        include: [{
          model: Address,
        }],
      }],
    });
  }

  public update(value: CustomerOrder, transaction: Transaction): Promise<[number, Array<CustomerOrder>]> {
    return CustomerOrder.update(value, {
      where: {id: value.id},
      transaction,
    });
  }
}
