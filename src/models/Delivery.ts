import {IArticle, IDelivery, IOrderItem, IPickupLocation, IShipment} from "citrus-common";
import {BelongsToMany, Column, HasMany, Model, Table} from "sequelize-typescript";
import {Article} from "./Article";
import {OrderItem} from "./OrderItem";
import {PickupLocation} from "./PickupLocation";
import {PickupLocationDelivery} from "./PickupLocationDelivery";
import {Shipment} from "./Shipment";

@Table
export class Delivery extends Model<Delivery> implements IDelivery {

  @Column
  public date: Date;

  @Column
  public comment: string;

  @HasMany(() => Article)
  public articles: IArticle[];

  @HasMany(() => OrderItem)
  public orderItems: IOrderItem[];

  @HasMany(() => Shipment)
  public shipments: IShipment[];

  @BelongsToMany(() => PickupLocation, () => PickupLocationDelivery)
  public pickupLocations: IPickupLocation[];
}
