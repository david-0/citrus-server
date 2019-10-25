import {getManager, LessThan} from "typeorm";
import {ResetToken} from "../entity/ResetToken";
import {UserNotConfirmed} from "../entity/UserNotConfirmed";

export class UserNotConfirmedEvictor {

  public schedule(nextInMinutes: number) {
    setTimeout(() => {
      this.evict();
      this.schedule(15);
    }, nextInMinutes * 60 * 1000);
  }

  private evict() {
    getManager().getRepository(UserNotConfirmed).delete({validTo: LessThan(new Date())});
  }
}
