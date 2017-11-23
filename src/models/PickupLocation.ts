import {IAddress, IDelivery, IPickupLocation, IUser} from "citrus-common";
import {BelongsTo, BelongsToMany, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Address} from "./Address";
import {Delivery} from "./Delivery";
import {PickupLocationDelivery} from "./PickupLocationDelivery";
import {User} from "./User";

@Table
export class PickupLocation extends Model<PickupLocation> implements IPickupLocation {
  @BelongsToMany(() => Delivery, () => PickupLocationDelivery)
  public deliveries: IDelivery[];

  @Column
  public fromDate: Date;

  @Column
  public toDate: Date;

  @ForeignKey(() => User)
  @Column
  public contactUserId: number;

  @BelongsTo(() => User)
  public contactUser: IUser;

  @ForeignKey(() => Address)
  @Column
  public addressId: number;

  @BelongsTo(() => Address)
  public address: IAddress;
}
