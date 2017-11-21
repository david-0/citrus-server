import {IId} from "./IId";

export interface IUser extends IId {
  email: string;
  password: string;
  name: string;
  prename: string;
  telNumber: string;
  mobileNumber: string;
}
