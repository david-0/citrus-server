import { OrderItemDto } from "citrus-common";
import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { OrderItemConverter } from "../converter/OrderItemConverter";
import { OrderItem } from "../entity/OrderItem";
import { ArticleStock } from "../entity/ArticleStock";
import { Order } from "../entity/Order";

@Authorized("admin")
@JsonController("/api/orderItem")
export class OrderItemController {
  private orderItemRepo: (manager: EntityManager) => Repository<OrderItem>;

  constructor() {
    this.orderItemRepo = manager => manager.getRepository(OrderItem);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public async get(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<OrderItemDto> {
    return OrderItemConverter.toDto(await this.orderItemRepo(manager).findOne(id));
  }

  @Transaction()
  @Get()
  public async getAll(@TransactionManager() manager: EntityManager): Promise<OrderItemDto[]> {
    return OrderItemConverter.toDtos(await this.orderItemRepo(manager).find({
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Post()
  public async save(@TransactionManager() manager: EntityManager, @Body() newItem: OrderItem): Promise<OrderItemDto> {
    const item = OrderItemConverter.toEntity(newItem);
    const savedItem = await this.orderItemRepo(manager).save(item);
    await this.updateOnInsert(manager, item);
    return OrderItemConverter.toDto(savedItem);
  }

  @Transaction()
  @Put("/:id([0-9]+)")
  public async update(@TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() changedItem: OrderItem): Promise<OrderItemDto> {
    const a = OrderItemConverter.toEntity(changedItem);
    a.id = +id;
    await this.updateOnRemove(manager, a);
    const saved = await this.orderItemRepo(manager).save(a);
    await this.updateOnInsert(manager, a);
    return OrderItemConverter.toDto(saved);
  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<OrderItemDto> {
    const orderItem = new OrderItem();
    orderItem.id = +id;
    await this.updateOnRemove(manager, orderItem);
    const saved = await this.orderItemRepo(manager).remove(orderItem);
    return OrderItemConverter.toDto(saved);
  }

  private async updateOnInsert(manager: EntityManager, entity: OrderItem) {
    await this.updateStockOnInsert(manager, entity);
    await this.updateTotalPriceOnInsert(manager, entity);
  }

  private async updateOnRemove(manager: EntityManager, entity: OrderItem) {
    await this.updateStockOnRemove(manager, entity);
    await this.updateTotalPriceOnRemove(manager, entity);
  }

  private async updateStockOnInsert(manager: EntityManager, entity: OrderItem) {
    const loadedEntity = await this.ensureOrderAndArticleLoaded(entity, manager);
    const stock = await this.loadArticleStock(manager, entity.article.id, loadedEntity.order.location.id);
    stock.reservedQuantity += +entity.quantity;
    await manager.getRepository(ArticleStock).save(stock);
  }

  private async updateStockOnRemove(manager: EntityManager, entity: OrderItem) {
    const loadedEntity = await this.ensureOrderAndArticleLoaded(entity, manager);
    const stock = await this.loadArticleStock(manager, loadedEntity.article.id, loadedEntity.order.location.id);
    stock.reservedQuantity -= +loadedEntity.quantity;
    await manager.getRepository(ArticleStock).save(stock);
  }

  private async updateTotalPriceOnInsert(manager: EntityManager, entity: OrderItem) {
    const loadedEntity = await this.ensureOrderAndArticleLoaded(entity, manager);
    loadedEntity.order.totalPrice += loadedEntity.quantity * loadedEntity.article.price;
    await manager.getRepository(Order).save(loadedEntity.order);
  }

  private async updateTotalPriceOnRemove(manager: EntityManager, entity: OrderItem) {
    const loadedEntity = await this.ensureOrderAndArticleLoaded(entity, manager);
    loadedEntity.order.totalPrice -= loadedEntity.quantity * loadedEntity.article.price;
    await manager.getRepository(Order).save(loadedEntity.order);
  }

  private async ensureOrderAndArticleLoaded(entity: OrderItem, manager: EntityManager) {
    if (!entity.article || !entity.order || !entity.order.id || !entity.order.location || !entity.order.location.id) {
      entity = await manager.getRepository(OrderItem).findOne(entity.id, {
        relations: [
          "article",
          "order",
          "order.location",
        ],
      });
    }
    return entity;
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
}
