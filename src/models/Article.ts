import {BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, Table,} from "sequelize-typescript";
import {ArticlePickupLocation} from "./ArticlePickupLocation";
import {EArticleStatus} from "../EArticleStatus";
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

  @Column
  public status: EArticleStatus;

  @BelongsTo(() => UnitOfMeasurement)
  public unitOfMeasurement: UnitOfMeasurement;

  @Column
  public visibleFrom: Date;

  @HasMany(() => VendorOrderItem)
  public vendorOrderItems: VendorOrderItem[];

  @HasMany(() => PricedArticle)
  public pricedArticles: PricedArticle[];

  @BelongsToMany(() => PickupLocation, () => ArticlePickupLocation)
  public pickupLocations: PickupLocation[];
}
