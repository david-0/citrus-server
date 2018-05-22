import {IBeforeUpdate} from "../controllers/IBeforeInterface";
import {Address} from "../models/Address";
import {PickupLocation} from "../models/PickupLocation";

export class PickupLocationProjector implements IBeforeUpdate<PickupLocation> {
  public beforeUpdate(instance: PickupLocation) {
    if (instance.address && instance.address.id) {
      instance.addressId = instance.address.id;
    }
  }
}
