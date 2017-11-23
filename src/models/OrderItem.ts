import {IDelivery, IOrderItem} from "citrus-common";
import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Delivery} from "./Delivery";
import {Order} from "./Order";

@Table
export class OrderItem extends Model<OrderItem> implements IOrderItem {

  @ForeignKey(() => Order)
  @Column
  public orderId: number;

  @BelongsTo(() => Order)
  public order: Order;

  @Column
  public articleId: number;

  @Column
  public articleNumber: number;

  @Column
  public articleDescription: string;

  @Column
  public articlePrice: string;

  @Column
  public articleAmount: number;

  @ForeignKey(() => Delivery)
  @Column
  public articleDeliveryId: number;

  @BelongsTo(() => Delivery)
  public acticleDelivery: IDelivery;
}
