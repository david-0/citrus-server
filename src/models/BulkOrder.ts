import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {CustomerOrder} from "./CustomerOrder";
import {PickupLocation} from "./PickupLocation";

@Table
export class BulkOrder extends Model<BulkOrder> {

  @ForeignKey(() => PickupLocation)
  @Column
  public pickupLocationId: number;

  @BelongsTo(() => PickupLocation)
  public pickupLocation: PickupLocation;

  @HasMany(() => CustomerOrder)
  public customerOrders: CustomerOrder[];
}
