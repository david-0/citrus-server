import {BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {IGpsLocation} from "../entities/IGpsLocation";
import {IPickupLocaltion} from "../entities/IPickupLocaltion";
import {Delivery} from "./Delivery";
import {IDelivery} from "../entities/IDelivery";
import {User} from "./User";
import {IUser} from "../entities/IUser";
import {Address} from "./Address";
import {IAddress} from "../entities/IAddress";
import {PickupLocationDelivery} from "./PickupLocationDelivery";

@Table
export class PickupLocation extends Model<PickupLocation> implements IPickupLocaltion {
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
