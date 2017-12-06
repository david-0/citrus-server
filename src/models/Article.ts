import {
  EArticleStatus,
  IArticle,
  IPickupLocation,
  IPricedArticle,
  IUnitOfMeasurement,
  IVendorOrderItem
} from "citrus-common";
import {BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {ArticlePickupLocation} from "./ArticlePickupLocation";
import {PickupLocation} from "./PickupLocation";
import {PricedArticle} from "./PricedArticle";
import {Role} from "./Role";
import {UnitOfMeasurement} from "./UnitOfMeasurement";
import {UserRole} from "./UserRole";
import {VendorOrderItem} from "./VendorOrderItem";

@Table
export class Article extends Model<Article> implements IArticle {
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
  public unitOfMeasurement: IUnitOfMeasurement;

  @Column
  public status: EArticleStatus;

  @Column
  public visibleFrom: Date;

  @HasMany(() => VendorOrderItem)
  public vendorOrderItems: IVendorOrderItem[];

  @HasMany(() => PricedArticle)
  public pricedArticles: IPricedArticle[];

  @BelongsToMany(() => PickupLocation, () => ArticlePickupLocation)
  public pickupLocations: IPickupLocation[];
}
