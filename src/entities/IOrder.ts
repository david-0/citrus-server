import {IAddress} from "./IAddress";
import {IId} from "./IId";

export interface IOrder extends IId {
  description: string;
  date: Date;
  totalPrice: number;
  address: IAddress;
}
