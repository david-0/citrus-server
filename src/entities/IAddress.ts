import {IGpsLocation} from "./IGpsLocation";
import {IId} from "./IId";

export interface IAddress extends IId {
  name: string;
  prename: string;
  gpsLocation: IGpsLocation;
  street: string;
  number: string;
  plz: string;
  city: string;
}
