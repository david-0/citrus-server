import {EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent} from "typeorm";
import {ArticleCheckOut} from "../entity/ArticleCheckOut";
import {User} from "../entity/User";

@EventSubscriber()
export class ArticleCheckOutDoneSubscriber implements EntitySubscriberInterface<ArticleCheckOut> {
  public listenTo() {
    return ArticleCheckOut;
  }

  public async beforeUpdate(event: UpdateEvent<ArticleCheckOut>) {
    if (!event.databaseEntity.done && event.entity.done) {
      const user = await event.manager.getRepository(User).findOne(event.queryRunner.data);
      event.entity.doneDate = new Date();
      event.entity.doneUser = user;
    } else if (event.databaseEntity.done && !event.entity.done) {
      event.entity.doneDate = null;
      event.entity.doneUser = null;
    }
  }

  public async beforeInsert(event: InsertEvent<ArticleCheckOut>) {
    if (event.entity.done) {
      const user = await event.manager.getRepository(User).findOne(event.queryRunner.data);
      event.entity.doneDate = new Date();
      event.entity.doneUser = user;
    }
  }
}
