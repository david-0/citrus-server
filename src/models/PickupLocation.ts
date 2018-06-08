import {BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Address} from "./Address";
import {Article} from "./Article";
import {ArticlePickupLocation} from "./ArticlePickupLocation";
import {OpeningHour} from "./OpeningHour";

@Table
export class PickupLocation extends Model<PickupLocation>{

  @ForeignKey(() => Address)
  @Column
  public addressId: number;

  @BelongsTo(() => Address)
  public address: Address;

  @Column
  public description: string;

  @BelongsToMany(() => Article, () => ArticlePickupLocation)
  public availableArticles: Article[];

  @HasMany(() => OpeningHour)
  public openingHours: OpeningHour[];
}
