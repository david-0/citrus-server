import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Article} from "./Article";
import {PickupLocation} from "./PickupLocation";

@Table
export class ArticlePickupLocation extends Model<ArticlePickupLocation> {

  @ForeignKey(() => Article)
  @Column
  public articleId: number;

  @ForeignKey(() => PickupLocation)
  @Column
  public pickupLocationId: number;
}
