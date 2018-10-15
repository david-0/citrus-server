import {EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent} from "typeorm";
import {ArticleCheckIn} from "../entity/ArticleCheckIn";
import {User} from "../entity/User";

@EventSubscriber()
export class ArticleCheckInDoneSubscriber implements EntitySubscriberInterface<ArticleCheckIn> {
  public listenTo() {
    return ArticleCheckIn;
  }

  public async beforeUpdate(event: UpdateEvent<ArticleCheckIn>) {
    if (!event.databaseEntity.done && event.entity.done) {
      const user = await event.manager.getRepository(User).findOne(event.queryRunner.data);
      event.entity.doneDate = new Date();
      event.entity.doneUser = user;
    } else if (event.databaseEntity.done && !event.entity.done) {
      event.entity.doneDate = null;
      event.entity.doneUser = null;
    }
  }

  public async beforeInsert(event: InsertEvent<ArticleCheckIn>) {
    if (event.entity.done) {
      const user = await event.manager.getRepository(User).findOne(event.queryRunner.data);
      event.entity.doneDate = new Date();
      event.entity.doneUser = user;
    }
  }
}
