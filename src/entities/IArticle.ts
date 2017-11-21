import {IDelivery} from "./IDelivery";
import {IId} from "./IId";
import {IShipmentItem} from "./IShipmentItem";

export interface IArticle extends IId {
  number: number;
  description: string;
  price: number;
  amount: number;
  visibleFrom: Date;
  delivery: IDelivery;
  shipmentItems: IShipmentItem[];
}
