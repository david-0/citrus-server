import { OrderArchiveDto } from "citrus-common";
import { Authorized, CurrentUser, Delete, Get, JsonController, Param } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { OrderArchiveConverter } from "../converter/OrderArchiveConverter";
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
  public async archiveOrder(@CurrentUser({ required: true }) userId: number,
    @TransactionManager() manager: EntityManager,
    @Param("id") orderId: number): Promise<number> {
    const user = await this.userRepo(manager).findOne(userId, {
      relations: [
        "roles",
      ],
    });
    const order = await this.orderRepo(manager).findOne(orderId, {
      relations: [
        "user",
        "user.roles",
        "location",
        "orderItems",
        "orderItems.article",
        "orderItems.article.unitOfMeasurement",
        "plannedCheckout",
        "checkingOutUser",
      ],
      order: {
        id: "ASC"
      },
    });
    const archiveOrder = new OrderArchive();
    archiveOrder.archiveDate = new Date();
    archiveOrder.archiveUser = JSON.stringify(user);
    archiveOrder.order = JSON.stringify(order);
    await this.orderArchiveRepo(manager).save(archiveOrder);

    for (const item of order.orderItems) {
      await manager.getRepository(OrderItem).remove(item);
    }
    await this.orderRepo(manager).remove(order);
    return order.id;
  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<OrderArchiveDto> {
    const orderArchive = new OrderArchive();
    orderArchive.id = +id;
    return OrderArchiveConverter.toDto(await this.orderArchiveRepo(manager).remove(orderArchive));
  }
}
