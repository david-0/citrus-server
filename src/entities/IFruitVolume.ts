import {IFruit} from './IFruit';
import {ITransport} from './ITransport';
import {IId} from './IId';

export interface IFruitVolume extends IId {
  fruit: IFruit;
  weightInKg: number;
  transport: ITransport;
}
