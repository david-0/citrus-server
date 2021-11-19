import {getLogger, Logger} from "log4js";
import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import {ArticleCheckIn} from "../entity/ArticleCheckIn";
import {ArticleStock} from "../entity/ArticleStock";

@EventSubscriber()
export class ArticleCheckInQuantityUpdateSubscriber implements EntitySubscriberInterface<ArticleCheckIn> {
  private LOGGER: Logger = getLogger("ArticleCheckInDoneSubscriber");

  public listenTo() {
    return ArticleCheckIn;
  }

  public async afterInsert(event: InsertEvent<ArticleCheckIn>) {
    this.LOGGER.info("start after insert, entity: " + JSON.stringify(event.entity));
    await this.add(event.manager, event.entity);
    this.LOGGER.info("end after insert");
  }

  public async beforeUpdate(event: UpdateEvent<ArticleCheckIn>) {
    this.LOGGER.info("start before update, database-entity: " + JSON.stringify(event.databaseEntity));
    await this.remove(event.manager, event.databaseEntity);
    this.LOGGER.info("end before update");
  }

  public async afterUpdate(event: UpdateEvent<ArticleCheckIn>) {
    this.LOGGER.info("start after update, entity: " + JSON.stringify(event.entity));
    await this.add(event.manager, <ArticleCheckIn> event.entity);
    this.LOGGER.info("end after update");
  }

  public async beforeRemove(event: RemoveEvent<ArticleCheckIn>) {
    this.LOGGER.info("start before remove, entity: " + JSON.stringify(event.entity));
    await this.remove(event.manager, event.entity);
    this.LOGGER.info("end before remove");
  }

  private async add(manager: EntityManager, entity: ArticleCheckIn) {
    this.LOGGER.info("start add, entity: " + JSON.stringify(entity));
    const stock = await manager.getRepository(ArticleStock).findOne(entity.articleStock.id);
    if (entity.done) {
      stock.quantity += +entity.quantity;
    }
    await manager.getRepository(ArticleStock).save(stock);
    this.LOGGER.info("end add");
  }

  private async remove(manager: EntityManager, entity: ArticleCheckIn) {
    this.LOGGER.info("start remove, entity: " + JSON.stringify(entity));
    if (!entity.articleStock) {
      entity = await manager.getRepository(ArticleCheckIn).findOne(entity.id, {relations: ["articleStock"]});
    }
    const stock = await manager.getRepository(ArticleStock).findOne(entity.articleStock.id);
    if (entity.done) {
      stock.quantity -= +entity.quantity;
    }
    await manager.getRepository(ArticleStock).save(stock);
    this.LOGGER.info("end remove");
  }
}
