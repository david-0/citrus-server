import {Order} from "../models/Order";
import {IDelivery} from "./IDelivery";
import {IId} from "./IId";

export interface IOrderItem extends IId {
  order: Order;
  articleId: number;
  articleNumber: number;
  articleDescription: string;
  articlePrice: string;
  articleAmount: number;
  acticleDelivery: IDelivery;
}
