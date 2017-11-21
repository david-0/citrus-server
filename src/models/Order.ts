import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {IDelivery} from "../entities/IDelivery";
import {Article} from "./Article";
import {IOrder} from "../entities/IOrder";
import {Address} from "./Address";
import {IAddress} from "../entities/IAddress";
import {User} from "./User";
import {IUser} from "../entities/IUser";
import {IOrderItem} from "../entities/IOrderItem";
import {OrderItem} from "./OrderItem";

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
