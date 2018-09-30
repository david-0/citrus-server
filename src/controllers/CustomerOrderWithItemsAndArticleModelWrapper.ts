import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {Transaction} from "sequelize-typescript/node_modules/@types/sequelize";
import {Address} from "../models/Address";
import {Article} from "../models/Article";
import {CustomerOrder} from "../models/CustomerOrder";
import {CustomerOrderItem} from "../models/CustomerOrderItem";
import {Location} from "../models/Location";
import {UnitOfMeasurement} from "../models/UnitOfMeasurement";
import {User} from "../models/User";
import {IModelWrapper} from "./IModelWrapper";

export class CustomerOrderWithItemsAndArticleModelWrapper implements IModelWrapper<CustomerOrder> {

  public name() {
    return "CustomerOrder";
  }

  public create(value: CustomerOrder, transaction: Transaction): Promise<CustomerOrder> {
    return CustomerOrder.create(value, {
      fields: ["userId", "pickupLocationId", "bulkOrderId", "date"],
      transaction
    });
  }

  public findAll(transaction: Transaction): Promise<CustomerOrder[]> {
    return CustomerOrder.findAll({
      include: [{
        include: [{
          include: [UnitOfMeasurement],
          model: Article,
        }],
        model: CustomerOrderItem,
      }, {
        attributes: {exclude: ["password"]},
        model: User,
      }, {
        include: [{
          model: Address,
        }],
        model: Location,
      }],
      transaction,
    });
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: CustomerOrder[]; count: number; }> {
    return CustomerOrder.findAndCountAll({
      include: [{
        include: [{
          include: [UnitOfMeasurement],
          model: Article,
        }],
        model: CustomerOrderItem,
      }, {
        attributes: {exclude: ["password"]},
        model: User,
      }, {
        include: [{
          model: Address,
        }],
        model: Location,
      }],
      transaction,
    });
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<CustomerOrder> {
    return CustomerOrder.findById(identifier, {
      include: [{
        include: [{
          include: [UnitOfMeasurement],
          model: Article,
        }],
        model: CustomerOrderItem,
      }, {
        attributes: {exclude: ["password"]},
        model: User,
      }, {
        include: [{
          model: Address,
        }],
        model: Location,
      }],
      transaction,
    });
  }

  public update(value: CustomerOrder, transaction: Transaction): Promise<[number, Array<CustomerOrder>]> {
    return CustomerOrder.update(value, {
      fields: ["userId", "pickupLocationId", "bulkOrderId"],
      transaction,
      where: {id: value.id},
    });
  }

  public delete(value: CustomerOrder, transaction: Transaction): Promise<void> {
    return value.destroy({transaction});
  }
}
