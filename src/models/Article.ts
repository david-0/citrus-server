import {BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {ArticlePickupLocation} from "./ArticlePickupLocation";
import {EArticleStatus} from "./e-article-status";
import {PickupLocation} from "./PickupLocation";
import {PricedArticle} from "./PricedArticle";
import {UnitOfMeasurement} from "./UnitOfMeasurement";
import {VendorOrderItem} from "./VendorOrderItem";

@Table
export class Article extends Model<Article> {
  @Column
  public number: number;

  @Column
  public description: string;

  @Column
  public stock: number;

  @ForeignKey(() => UnitOfMeasurement)
  @Column
  public unitOfMeasurementId: number;

  @BelongsTo(() => UnitOfMeasurement)
  public unitOfMeasurement: UnitOfMeasurement;

  @Column
  public status: EArticleStatus;

  @Column
  public visibleFrom: Date;

  @HasMany(() => VendorOrderItem)
  public vendorOrderItems: VendorOrderItem[];

  @HasMany(() => PricedArticle)
  public pricedArticles: PricedArticle[];

  @BelongsToMany(() => PickupLocation, () => ArticlePickupLocation)
  public pickupLocations: PickupLocation[];
}
