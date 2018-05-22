import {IBeforeUpdate} from "../controllers/IBeforeInterface";
import {Address} from "../models/Address";
import {CustomerOrder} from "../models/CustomerOrder";

export class CustomerOrderProjector implements IBeforeUpdate<CustomerOrder> {
  public beforeUpdate(instance: CustomerOrder) {
    if (instance.user && instance.user.id) {
      instance.userId = instance.user.id;
    }
    if (instance.bulkOrder && instance.bulkOrder.id) {
      instance.bulkOrderId = instance.bulkOrder.id;
    }
  }
}
