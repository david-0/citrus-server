import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {IDelivery} from "../entities/IDelivery";
import {Article} from "./Article";
import {OrderItem} from "./OrderItem";
import {IShipment} from "../entities/IShipment";
import {Delivery} from "./Delivery";
import {IShipmentItem} from "../entities/IShipmentItem";
import {Shipment} from "./Shipment";
import {IArticle} from "../entities/IArticle";

@Table
export class ShipmentItem extends Model<ShipmentItem> implements IShipmentItem {
  @ForeignKey(() => Shipment)
  @Column
  public shipmentId: number;

  @BelongsTo(() => Shipment)
  public shipment: IShipment;

  @ForeignKey(() => Article)
  @Column
  public ArticleId: number;

  @BelongsTo(() => Article)
  public article: IArticle;

  @Column
  public amount: number;

  @Column
  public comment: string;

}
