import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import {ArticleCheckIn} from "../models/ArticleCheckIn";
import {ArticleStock} from "../models/ArticleStock";

@EventSubscriber()
export class ArticleCheckInSubscriber implements EntitySubscriberInterface<ArticleCheckIn> {
  public listenTo() {
    return ArticleCheckIn;
  }

  public async afterInsert(event: InsertEvent<ArticleCheckIn>) {
    await this.add(event.manager, event.entity);
  }

  public async beforeUpdate(event: UpdateEvent<ArticleCheckIn>) {
    await this.remove(event.manager, event.databaseEntity);
  }

  public async afterUpdate(event: UpdateEvent<ArticleCheckIn>) {
    await this.add(event.manager, event.entity);
  }

  public async beforeRemove(event: RemoveEvent<ArticleCheckIn>) {
    await this.remove(event.manager, event.entity);
  }

  private async add(manager: EntityManager, entity: ArticleCheckIn) {
    const stock = await manager.getRepository(ArticleStock).findOne(entity.articleStock.id);
    if (entity.done) {
      stock.quantity += +entity.quantity;
    }
    await manager.getRepository(ArticleStock).save(stock);
  }

  private async remove(manager: EntityManager, entity: ArticleCheckIn) {
    if (!entity.articleStock) {
      entity = await manager.getRepository(ArticleCheckIn).findOne(entity.id, {relations: ["articleStock"]});
    }
    const stock = await manager.getRepository(ArticleStock).findOne(entity.articleStock.id);
    if (entity.done) {
      stock.quantity -= +entity.quantity;
    }
    await manager.getRepository(ArticleStock).save(stock);
  }
}
