import * as Promise from "bluebird";
import {Transaction} from "sequelize";
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
      transaction,
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }, {
        model: Location,
      }],
    });
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: CustomerOrder[]; count: number; }> {
    return CustomerOrder.findAndCountAll({
      transaction,
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }, {
        model: Location,
      }],
    });
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<CustomerOrder> {
    return CustomerOrder.findById(identifier, {
      transaction,
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }, {
        model: Location,
      }],
    });
  }

  public update(value: CustomerOrder, transaction: Transaction): Promise<[number, Array<CustomerOrder>]> {
    return CustomerOrder.update(value, {
      fields: ["userId", "pickupLocationId", "bulkOrderId"],
      where: {id: value.id},
      transaction,
    });
  }

  public delete(order: CustomerOrder, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      CustomerOrderItem.findAll({where: {customerOrderId: order.id}, transaction}).then((items) => {
        let deletePromises = items.map((item) => this.itemWrapper.delete(item, transaction));
        Promise.all(deletePromises).then((results) => {
          order.destroy({transaction})
            .then((results) => resolve())
            .catch((error) => reject(error));
        }).catch((error) => reject(error));
      }).catch((error) => reject(error));
    });
  }
}
