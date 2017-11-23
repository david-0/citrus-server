import {IArticle, IShipment, IShipmentItem} from "citrus-common";
import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Article} from "./Article";
import {Shipment} from "./Shipment";

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
