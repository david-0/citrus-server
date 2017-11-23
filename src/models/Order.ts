import {IAddress, IOrder, IOrderItem, IUser} from "citrus-common";
import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Address} from "./Address";
import {OrderItem} from "./OrderItem";
import {User} from "./User";

@Table
export class Order extends Model<Order> implements IOrder {

  @Column
  public description: string;

  @Column
  public date: Date;

  @Column
  public totalPrice: number;

  @ForeignKey(() => Address)
  @Column
  public addressId: number;

  @BelongsTo(() => Address)
  public address: IAddress;

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @BelongsTo(() => User)
  public user: IUser;

  @HasMany(() => OrderItem)
  public items: IOrderItem[];
}
