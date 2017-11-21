import {IDelivery} from "./IDelivery";
import {IId} from "./IId";

export interface IShipment extends IId {
  number: number;
  comment: string;
  arrivalDate: Date;
  delivery: IDelivery;
}
