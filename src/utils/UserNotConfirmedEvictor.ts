import { LessThan } from "typeorm";
import { UserNotConfirmed } from "../entity/UserNotConfirmed";
import { AppDataSource } from "./app-data-source";

export class UserNotConfirmedEvictor {

  public schedule(nextInMinutes: number) {
    setTimeout(() => {
      this.evict();
      this.schedule(15);
    }, nextInMinutes * 60 * 1000);
  }

  private evict() {
    AppDataSource.getRepository(UserNotConfirmed).delete({ validTo: LessThan(new Date()) });
  }
}
