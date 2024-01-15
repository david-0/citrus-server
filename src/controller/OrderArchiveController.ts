import { OrderArchiveDto } from "citrus-common";
import { Authorized, CurrentUser, Delete, Get, JsonController, Param } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { OrderArchiveConverter } from "../converter/OrderArchiveConverter";
import { ArticleStock } from "../entity/ArticleStock";
import { Order } from "../entity/Order";
import { OrderArchive } from "../entity/OrderArchive";
import { OrderItem } from "../entity/OrderItem";
import { User } from "../entity/User";

@Authorized("admin")
@JsonController("/api/orderArchive")
export class OrderArchiveController {
  private orderArchiveRepo: (manager: EntityManager) => Repository<OrderArchive>;
  private userRepo: (manager: EntityManager) => Repository<User>;
  private orderRepo: (manager: EntityManager) => Repository<Order>;

  constructor() {
    this.orderArchiveRepo = manager => manager.getRepository(OrderArchive);
    this.userRepo = manager => manager.getRepository(User);
    this.orderRepo = manager => manager.getRepository(Order);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public async get(@TransactionManager() manager: EntityManager,
    @Param("id") id: number) {
    return OrderArchiveConverter.toDto(await this.orderArchiveRepo(manager).findOne(id));
  }

  @Transaction()
  @Get()
  public async getAll(@TransactionManager() manager: EntityManager) {
    const orderArchiveList = await this.orderArchiveRepo(manager).find();
    return OrderArchiveConverter.toDtos(orderArchiveList);
  }

  @Transaction()
  @Get("/archiving/:id([0-9]+)")
  public async archiveOrder(@CurrentUser({ required: true }) userId: number, @TransactionManager() manager: EntityManager, @Param("id") orderId: number): Promise<number> {
    const user = await this.reloadUserWithRoles(manager, userId);
    const order = await this.reloadOrderWithAll(manager, orderId);
    await this.createArchiveOrderAndSave(user, order, manager);
    await this.revertReservationQuantityAndDeleteOrder(order, manager);
    return orderId;
  }

  private async reloadOrderWithAll(manager: EntityManager, orderId: number) {
    return await this.orderRepo(manager).findOne(orderId, {
      relations: [
        "user",
        "user.roles",
        "location",
        "orderItems",
        "orderItems.article",
        "orderItems.article.unitOfMeasurement",
        "plannedCheckout",
      ],
      order: {
        id: "ASC"
      },
    });
  }

  private async reloadUserWithRoles(manager: EntityManager, userId: number) {
    return await this.userRepo(manager).findOne(userId, {
      relations: [
        "roles",
      ],
    });
  }

  private async revertReservationQuantityAndDeleteOrder(order: Order, manager: EntityManager) {
    for (const item of order.orderItems) {
      await this.revertReservedQuantity(manager, item, order.location.id);
      await manager.getRepository(OrderItem).remove(item);
    }
    await this.orderRepo(manager).remove(order);
  }

  private async createArchiveOrderAndSave(user: User, order: Order, manager: EntityManager) {
    const archiveOrder = new OrderArchive();
    archiveOrder.archiveDate = new Date();
    archiveOrder.archiveUser = JSON.stringify(user);
    archiveOrder.order = JSON.stringify(order);
    await this.orderArchiveRepo(manager).save(archiveOrder);
  }

  private async revertReservedQuantity(manager: EntityManager, orderItem: OrderItem, locationId: number) {
    const stock = await this.loadArticleStock(manager, orderItem.article.id, locationId);
    stock.reservedQuantity -= +orderItem.quantity;
    await manager.getRepository(ArticleStock).save(stock);
  }

  private async loadArticleStock(manager: EntityManager, articleId: number, locationId: number): Promise<ArticleStock> {
    return (await manager.getRepository(ArticleStock)
      .find({
        relations: ["article", "location"],
        where:
        {
          article: { id: articleId },
          location: { id: locationId },
        },
      }))[0];
  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<OrderArchiveDto> {
    const orderArchive = new OrderArchive();
    orderArchive.id = +id;
    return OrderArchiveConverter.toDto(await this.orderArchiveRepo(manager).remove(orderArchive));
  }
}
