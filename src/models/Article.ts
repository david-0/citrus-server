import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {IArticle} from "../entities/IArticle";
import {IDelivery} from "../entities/IDelivery";
import {IShipmentItem} from "../entities/IShipmentItem";
import {Delivery} from "./Delivery";
import {ShipmentItem} from "./ShipmentItem";

@Table
export class Article extends Model<Article> implements IArticle {

  @Column
  public number: number;

  @Column
  public description: string;

  @Column
  public price: number;

  @Column
  public amount: number;

  @Column
  public visibleFrom: Date;

  @ForeignKey(() => Delivery)
  @Column
  public deliveryId: number;

  @BelongsTo(() => Delivery)
  public delivery: IDelivery;

  @HasMany(() => ShipmentItem)
  public shipmentItems: IShipmentItem[];
}
