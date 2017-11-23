import {IDelivery, IShipment, IShipmentItem} from "citrus-common";
import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Delivery} from "./Delivery";
import {ShipmentItem} from "./ShipmentItem";

@Table
export class Shipment extends Model<Shipment> implements IShipment {

  @Column
  public number: number;

  @Column
  public arrivalDate: Date;

  @Column
  public comment: string;

  @ForeignKey(() => Delivery)
  @Column
  public deliveryId: number;

  @BelongsTo(() => Delivery)
  public delivery: IDelivery;

  @HasMany(() => ShipmentItem)
  public shipmentItems: IShipmentItem[];
}
