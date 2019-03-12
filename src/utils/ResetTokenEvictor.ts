import {getManager, LessThan} from "typeorm";
import {ResetToken} from "../entity/ResetToken";

export class ResetTokenEvictor {

  public schedule(nextInMinutes: number) {
    setTimeout(() => {
      this.evict();
      this.schedule(15);
    }, nextInMinutes * 60 * 1000);
  }

  private evict() {
    getManager().getRepository(ResetToken).delete({validTo: LessThan(new Date())});
  }
}
