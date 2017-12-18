import {IBeforeUpdate} from "../controllers/IBeforeInterface";
import {Address} from "../models/Address";

export class AddressProjector implements IBeforeUpdate<Address> {
  public beforeUpdate(instance: Address) {
    if (instance.user && instance.user.id) {
      instance.userId = instance.user.id;
    }
    if (instance.gpsLocation && instance.gpsLocation.id) {
      instance.gpsLocationId = instance.gpsLocation.id;
    }
  }
}
