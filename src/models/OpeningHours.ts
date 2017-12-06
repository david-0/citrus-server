import {IGpsLocation, IOpeningHours, IPickupLocation} from "citrus-common";
import {BelongsTo, Column, ForeignKey, HasOne, Model, Table} from "sequelize-typescript";
import {GpsLocation} from "./GpsLocation";
import {PickupLocation} from "./PickupLocation";

@Table
export class OpeningHours extends Model<OpeningHours> implements IOpeningHours {
  @Column
  public fromDate: Date;

  @Column
  public toDate: Date;

  @ForeignKey(() => PickupLocation)
  @Column
  public pickupLocationId: number;

  @BelongsTo(() => PickupLocation)
  public pickupLocation: IPickupLocation;

}
