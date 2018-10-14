import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import {ArticleCheckIn} from "../entity/ArticleCheckIn";
import {ArticleCheckOut} from "../entity/ArticleCheckOut";
import {ArticleStock} from "../entity/ArticleStock";
import {CustomerOrderItem} from "../entity/CustomerOrderItem";

@EventSubscriber()
export class ArticleCheckOutQuantityUpdateSubscriber implements EntitySubscriberInterface<ArticleCheckOut> {
  public listenTo() {
    return ArticleCheckOut;
  }

  public async afterInsert(event: InsertEvent<ArticleCheckOut>) {
    await this.add(event.manager, event.entity);
  }

  public async beforeUpdate(event: UpdateEvent<ArticleCheckOut>) {
    await this.remove(event.manager, event.databaseEntity);
  }

  public async afterUpdate(event: UpdateEvent<ArticleCheckOut>) {
    await this.add(event.manager, event.entity);
  }

  public async beforeRemove(event: RemoveEvent<ArticleCheckOut>) {
    await this.remove(event.manager, event.entity);
  }

  private async add(manager: EntityManager, entity: ArticleCheckOut) {
    const stock = await manager.getRepository(ArticleStock).findOne(entity.articleStock.id);
    if (entity.done) {
      stock.quantity -= +entity.quantity;
    } else {
      stock.reservedQuantity += +entity.quantity;
    }
    await manager.getRepository(ArticleStock).save(stock);
  }

  private async remove(manager: EntityManager, entity: ArticleCheckOut) {
    if (!entity.articleStock) {
      entity = await manager.getRepository(ArticleCheckOut).findOne(entity.id, {relations: ["articleStock"]});
    }
    const stock = await manager.getRepository(ArticleStock).findOne(entity.articleStock.id);
    if (entity.done) {
      stock.quantity += +entity.quantity;
    } else {
      stock.reservedQuantity -= +entity.quantity;
    }
    await manager.getRepository(ArticleStock).save(stock);
  }
}
