import * as Promise from "bluebird";
import {PickupLocationDto} from "citrus-common/lib/dto/pickup-location-dto";
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

  public create(value: CustomerOrder): Promise<CustomerOrder> {
    return CustomerOrder.create(value);
  }

  public findAll(): Promise<CustomerOrder[]> {
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
    });
  }

  public findAndCountAll(): Promise<{ rows: CustomerOrder[]; count: number; }> {
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
    });
  }

  public findById(identifier?: string | number): Promise<CustomerOrder> {
    return CustomerOrder.findById(identifier, {
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

  public update(value: CustomerOrder): Promise<[number, Array<CustomerOrder>]> {
    return CustomerOrder.update(value, {where: {id: value.id}});
  }
}
