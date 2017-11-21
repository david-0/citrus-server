import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Delivery} from "./Delivery";
import {PickupLocation} from "./PickupLocation";

@Table
export class PickupLocationDelivery extends Model<PickupLocationDelivery> {

  @ForeignKey(() => PickupLocation)
  @Column
  public pickupLocationId: number;

  @ForeignKey(() => Delivery)
  @Column
  public deliveryId: number;
}
