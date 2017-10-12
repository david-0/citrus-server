import {IFruitVolume} from './IFruitVolume';
import {IId} from './IId';

export interface ITransport extends IId {
  departureDate: Date;
  fruitVolumes: IFruitVolume[];
  comment: string;
}
