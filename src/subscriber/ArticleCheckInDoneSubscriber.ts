import {getLogger, Logger} from "log4js";
import {EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent} from "typeorm";
import {ArticleCheckIn} from "../entity/ArticleCheckIn";
import {User} from "../entity/User";

@EventSubscriber()
export class ArticleCheckInDoneSubscriber implements EntitySubscriberInterface<ArticleCheckIn> {
  private LOGGER: Logger = getLogger("ArticleCheckInDoneSubscriber");

  public listenTo() {
    return ArticleCheckIn;
  }

  public async beforeUpdate(event: UpdateEvent<ArticleCheckIn>) {
    this.LOGGER.info("start before update");
    if (!event.databaseEntity.done && event.entity.done) {
      const user = await event.manager.getRepository(User).findOne(event.queryRunner.data);
      event.entity.doneDate = new Date();
      event.entity.doneUser = user;
    } else if (event.databaseEntity.done && !event.entity.done) {
      event.entity.doneDate = null;
      event.entity.doneUser = null;
    }
    this.LOGGER.info("end before update");
  }

  public async beforeInsert(event: InsertEvent<ArticleCheckIn>) {
    this.LOGGER.info("start before insert");
    if (event.entity.done) {
      const user = await event.manager.getRepository(User).findOne(event.queryRunner.data);
      event.entity.doneDate = new Date();
      event.entity.doneUser = user;
    }
    this.LOGGER.info("end before insert");
  }
}
