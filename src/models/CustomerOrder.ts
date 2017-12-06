import {IBulkOrder, ICustomerOrder, ICustomerOrderItem, IUnitOfMeasurement, IUser} from "citrus-common";
import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {BulkOrder} from "./BulkOrder";
import {CustomerOrderItem} from "./CustomerOrderItem";
import {UnitOfMeasurement} from "./UnitOfMeasurement";
import {User} from "./User";

@Table
export class CustomerOrder extends Model<CustomerOrder> implements ICustomerOrder {
  @Column
  public number: number;

  @Column
  public description: string;

  @Column
  public date: Date;

  @Column
  public totalPrice: number;

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @BelongsTo(() => User)
  public user: IUser;

  @HasMany(() => CustomerOrderItem)
  public customOrderItems: ICustomerOrderItem[];

  @ForeignKey(() => BulkOrder)
  @Column
  public bulkOrderId: number;

  @BelongsTo(() => BulkOrder)
  public bulkOrder: IBulkOrder;

}
