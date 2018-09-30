import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {Transaction} from "sequelize-typescript/node_modules/@types/sequelize";
import {CustomerOrder} from "../models/CustomerOrder";
import {CustomerOrderItem} from "../models/CustomerOrderItem";
import {Location} from "../models/Location";
import {User} from "../models/User";
import {CustomerOrderItemModelWrapper} from "./CustomerOrderItemModelWrapper";
import {IModelWrapper} from "./IModelWrapper";

export class CustomerOrderModelWrapper implements IModelWrapper<CustomerOrder> {

  public constructor(private itemWrapper: CustomerOrderItemModelWrapper) {
  }

  public name() {
    return "CustomerOrder";
  }

  public create(value: CustomerOrder, transaction: Transaction): Promise<CustomerOrder> {
    return CustomerOrder.create(value, {
      fields: ["userId", "pickupLocationId", "bulkOrderId", "date"],
      transaction,
    });
  }

  public findAll(transaction: Transaction): Promise<CustomerOrder[]> {
    return CustomerOrder.findAll({
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }, {
        model: Location,
      }],
      transaction,
    });
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: CustomerOrder[]; count: number; }> {
    return CustomerOrder.findAndCountAll({
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }, {
        model: Location,
      }],
      transaction,
    });
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<CustomerOrder> {
    return CustomerOrder.findById(identifier, {
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }, {
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

  public delete(order: CustomerOrder, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      CustomerOrderItem.findAll({where: {customerOrderId: order.id}, transaction}).then((items) => {
        const deletePromises = items.map((item) => this.itemWrapper.delete(item, transaction));
        Promise.all(deletePromises).then((results) => {
          order.destroy({transaction})
            .then((destroyed) => resolve())
            .catch((error) => reject(error));
        }).catch((error) => reject(error));
      }).catch((error) => reject(error));
    });
  }
}
