import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {BulkOrder} from "./BulkOrder";
import {CustomerOrderItem} from "./CustomerOrderItem";
import {PickupLocation} from "./PickupLocation";
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

  @ForeignKey(() => BulkOrder)
  @Column
  public bulkOrderId: number;

  @BelongsTo(() => BulkOrder)
  public bulkOrder: BulkOrder;

  @ForeignKey(() => PickupLocation)
  @Column
  public pickupLocationId: number;

  @BelongsTo(() => PickupLocation)
  public pickupLocation: PickupLocation;


}
