import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {PickupLocation} from "./PickupLocation";

@Table
export class OpeningHour extends Model<OpeningHour> {
  @Column
  public fromDate: Date;

  @Column
  public toDate: Date;

  @ForeignKey(() => PickupLocation)
  @Column
  public pickupLocationId: number;

  @BelongsTo(() => PickupLocation)
  public pickupLocation: PickupLocation;

}
