import {IFruitVolume} from "./IFruitVolume";

export interface ITransport {
  departureDate: Date;
  fruitVolumes: IFruitVolume[];
  comment: string;
}
