import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Article} from "./Article";
import {ArticleCheckIn} from "./ArticleCheckIn";
import {ArticleCheckOut} from "./ArticleCheckOut";
import {CustomerOrderItem} from "./CustomerOrderItem";
import {Location} from "./Location";

/**
 * Lagerbestand pro Standort
 */
@Table
export class ArticleStock extends Model<ArticleStock> {
  @ForeignKey(() => Article)
  @Column
  public articleId: number;

  @BelongsTo(() => Article)
  public article: Article;

  /**
   * Stock is a computed(redundant) column with the following formula:
   * <ul>
   *     <li>plus all CheckIn quantities (in the past)</li>
   *     <li>minus all Checkout quantities (in the past)</li>
   *     <li>minus all CustomerOrderItem[checkedOut=true] quantities</li>
   * </ul>
   */
  @Column
  public quantity: number;

  /**
   * Reserved is a computed(redundant) column with the following formula:
   * <ul>
   *     <li>plus all CustomerOrderItem[checkedOut=false] quantities</li>
   *     <li>plus all Checkout quantities(in the future)</li>
   * </ul>
   */
  @Column
  public reservedQuantity: number;

  @HasMany(() => ArticleCheckIn)
  public checkIns: ArticleCheckIn[];

  @HasMany(() => ArticleCheckOut)
  public checkOuts: ArticleCheckOut[];

  @HasMany(() => CustomerOrderItem)
  public customerOrderItems: CustomerOrderItem[];

  @ForeignKey(() => Location)
  @Column
  public locationId: number;

  @BelongsTo(() => Location)
  public location: Location;
}
