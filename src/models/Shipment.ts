import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {IDelivery} from "../entities/IDelivery";
import {Article} from "./Article";
import {OrderItem} from "./OrderItem";
import {IShipment} from "../entities/IShipment";
import {Delivery} from "./Delivery";
import {IShipmentItem} from "../entities/IShipmentItem";
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
