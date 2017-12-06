import {IBulkOrder, ICustomerOrder, IPickupLocation} from "citrus-common";
import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {CustomerOrder} from "./CustomerOrder";
import {PickupLocation} from "./PickupLocation";

@Table
export class BulkOrder extends Model<BulkOrder> implements IBulkOrder {

  @ForeignKey(() => PickupLocation)
  @Column
  public pickupLocationId: number;

  @BelongsTo(() => PickupLocation)
  public pickupLocation: IPickupLocation;

  @HasMany(() => CustomerOrder)
  public customerOrders: ICustomerOrder[];
}
