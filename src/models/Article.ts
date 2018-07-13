import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {addAttributeOptions} from "sequelize-typescript/lib/services/models";
import {EArticleStatus} from "../EArticleStatus";
import {ArticlePickupLocation} from "./ArticlePickupLocation";
import {CustomerOrderItem} from "./CustomerOrderItem";
import {PickupLocation} from "./PickupLocation";
import {UnitOfMeasurement} from "./UnitOfMeasurement";
import {VendorOrderItem} from "./VendorOrderItem";

function ToNumber(target: any, propertyKey: string): any {
  addAttributeOptions(target, propertyKey, {
    get(): any {
      return +this.getDataValue(propertyKey);
    },
  });
}

@Table
export class Article extends Model<Article> {
  @Column
  public number: number;

  @Column
  public description: string;

  @Column
  public pictureId: string;

  @Column
  public stock: number;

  @Column
  public reservedInOpenOrders: number;

  @ToNumber
  @Column({type: DataType.DECIMAL(10, 2)})
  public price: number;

  @Column
  public status: EArticleStatus;

  @ForeignKey(() => UnitOfMeasurement)
  @Column
  public unitOfMeasurementId: number;

  @BelongsTo(() => UnitOfMeasurement)
  public unitOfMeasurement: UnitOfMeasurement;

  @HasMany(() => VendorOrderItem)
  public vendorOrderItems: VendorOrderItem[];

  @HasMany(() => CustomerOrderItem)
  public customerOrderItems: CustomerOrderItem[];

  @BelongsToMany(() => PickupLocation, () => ArticlePickupLocation)
  public pickupLocations: PickupLocation[];
}
