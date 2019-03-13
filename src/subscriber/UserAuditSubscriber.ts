import {EntitySubscriberInterface, EventSubscriber, InsertEvent} from "typeorm";
import {UserAudit} from "../entity/UserAudit";

@EventSubscriber()
export class UserAuditSubscriber implements EntitySubscriberInterface<UserAudit> {
  public listenTo() {
    return UserAudit;
  }

  public async beforeInsert(event: InsertEvent<UserAudit>) {
    if (event.queryRunner.data && event.queryRunner.data.ip && event.queryRunner.data.ips) {
      const ips: string[] = [event.queryRunner.data.ip];
      ips.push(...event.queryRunner.data.ips);
      event.entity.ip = ips.join(", ");
    }
    if (event.queryRunner.data && event.queryRunner.data.headers) {
      event.entity.userAgent = event.queryRunner.data.headers["user-agent"];
    }
    event.entity.date = new Date();
  }
}
