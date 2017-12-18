import {IBeforeUpdate} from "../controllers/IBeforeInterface";
import {Address} from "../models/Address";
import {User} from "../models/User";

export class UserProjector implements IBeforeUpdate<User> {
  public beforeUpdate(instance: User) {
  }
}
