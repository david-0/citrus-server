import {IFruit} from "./IFruit";
import {ITransport} from "./ITransport";

export interface IFruitVolume {
  fruit: IFruit;
  weightInKg: number;
  transport: ITransport;
}
