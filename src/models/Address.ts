import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Location} from "./Location";
import {User} from "./User";

@Table
export class Address extends Model<Address> {
  @ForeignKey(() => User)
  @Column
  public userId: number;

  @BelongsTo(() => User)
  public user: User;

  @Column
  public description: string;

  @Column
  public name: string;

  @Column
  public prename: string;

  @Column
  public street: string;

  @Column
  public number: string;

  @Column
  public addition: string;

  @Column
  public zipcode: string;

  @Column
  public city: string;

  @HasMany(() => Location)
  public pickupLocations: Location[];
}
