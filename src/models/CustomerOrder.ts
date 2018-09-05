import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {CustomerOrderItem} from "./CustomerOrderItem";
import {User} from "./User";

@Table
export class CustomerOrder extends Model<CustomerOrder> {
  @Column
  public date: Date;

  @Column({type: DataType.DECIMAL(10, 2)})
  public totalPrice: number;

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @BelongsTo(() => User)
  public user: User;

  @HasMany(() => CustomerOrderItem)
  public customerOrderItems: CustomerOrderItem[];
}
