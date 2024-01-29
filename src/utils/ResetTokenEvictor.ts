import { LessThan } from "typeorm";
import { ResetToken } from "../entity/ResetToken";
import { AppDataSource } from "./app-data-source";

export class ResetTokenEvictor {

  public schedule(nextInMinutes: number) {
    setTimeout(() => {
      this.evict();
      this.schedule(15);
    }, nextInMinutes * 60 * 1000);
  }

  private evict() {
    AppDataSource.getRepository(ResetToken).delete({ validTo: LessThan(new Date()) });
  }
}
