import {IAddress} from "./IAddress";
import {IDelivery} from "./IDelivery";
import {IId} from "./IId";
import {IUser} from "./IUser";

export interface IPickupLocaltion extends IId {
  deliveries: IDelivery[];
  fromDate: Date;
  toDate: Date;
  contactUser: IUser;
  address: IAddress;
}
