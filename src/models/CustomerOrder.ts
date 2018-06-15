import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {BulkOrder} from "./BulkOrder";
import {CustomerOrderItem} from "./CustomerOrderItem";
import {User} from "./User";

@Table
export class CustomerOrder extends Model<CustomerOrder> {
  @Column
  public date: Date;

  @Column
  public totalPrice: number;

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @BelongsTo(() => User)
  public user: User;

  @HasMany(() => CustomerOrderItem)
  public customOrderItems: CustomerOrderItem[];

  @ForeignKey(() => BulkOrder)
  @Column
  public bulkOrderId: number;

  @BelongsTo(() => BulkOrder)
  public bulkOrder: BulkOrder;

}
