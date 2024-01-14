import { OrderDto } from "citrus-common";
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager, UpdateEvent } from "typeorm";
import { OrderConverter } from "../converter/OrderConverter";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";
import { OrderStockQuantityUpdater } from "./OrderStockQuantityUpdater";
import { User } from "../entity/User";

@Authorized("admin")
@JsonController("/api/order")
export class OrderController {
  private orderRepo: (manager: EntityManager) => Repository<Order>;
  private stockUpdater: OrderStockQuantityUpdater;

  constructor() {
    this.orderRepo = manager => manager.getRepository(Order);
    this.stockUpdater = new OrderStockQuantityUpdater();
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public async get(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<OrderDto> {
    return OrderConverter.toDto(await this.orderRepo(manager).findOne(id));
  }

  @Transaction()
  @Get()
  public async getAll(@TransactionManager() manager: EntityManager): Promise<OrderDto[]> {
    return OrderConverter.toDtos(await this.orderRepo(manager).find({
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Post()
  public async save(@CurrentUser({ required: true }) userId: number, @TransactionManager() manager: EntityManager, @Body() newOrder: Order): Promise<OrderDto> {
    const orderToInsert = OrderConverter.toEntity(newOrder);
    const savedOrder = await this.orderRepo(manager).save(orderToInsert, { data: userId });
    await this.stockUpdater.addStockQuantityAfterUpdate(manager, orderToInsert.id);
    return OrderConverter.toDto(savedOrder);
  }

  @Transaction()
  @Put("/:id([0-9]+)")
  public async update(@CurrentUser({ required: true }) userId: number, @TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() changedOrder: Order): Promise<OrderDto> {
    const order = OrderConverter.toEntity(changedOrder);
    order.id = +id;
    await this.updateTotalPriceBeforeUpdate(manager, order);
    await this.stockUpdater.removeStockQuantityBeforeUpdate(manager, order.id);
    const newOrder = await this.orderRepo(manager).save(order, { data: userId });
    await this.stockUpdater.addStockQuantityAfterUpdate(manager, order.id);
    return OrderConverter.toDto(newOrder);

  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<OrderDto> {
    const order = new Order();
    order.id = +id;
    await this.stockUpdater.removeStockQuantityBeforeUpdate(manager, order.id);
    return OrderConverter.toDto(await this.orderRepo(manager).remove(order));
  }

  @Transaction()
  @Get("/withAll/:id([0-9]+)")
  public async getWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<OrderDto> {
    return OrderConverter.toDto(await this.orderRepo(manager).findOne(id, {
      relations: [
        "user",
        "location",
        "orderItems",
        "orderItems.article",
        "orderItems.article.unitOfMeasurement",
        "plannedCheckout",
      ],
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Get("/withAll")
  public async getAllWithAll(@TransactionManager() manager: EntityManager): Promise<OrderDto[]> {
    return OrderConverter.toDtos(await this.orderRepo(manager).find({
      relations: [
        "user",
        "location",
        "orderItems",
        "orderItems.article",
        "orderItems.article.unitOfMeasurement",
        "plannedCheckout",
      ],
      order: {
        id: "ASC"
      },
    }));
  }

  @Post("/withAll")
  @Transaction()
  public async saveWithAll(@CurrentUser({ required: true }) userId: number, @TransactionManager() manager: EntityManager,
    @Body() newOrder: Order): Promise<OrderDto> {
    const orderToInsert = OrderConverter.toEntity(newOrder);
    const savedOrder = await this.orderRepo(manager).save(orderToInsert, { data: userId });
    await this.stockUpdater.addStockQuantityAfterUpdate(manager, savedOrder.id);
    return OrderConverter.toDto(savedOrder);
  }

  @Put("/withAll/:id([0-9]+)")
  @Transaction()
  public async updateWithAll(@CurrentUser({ required: true }) userId: number, @TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() changedOrder: Order): Promise<OrderDto> {
    const a = OrderConverter.toEntity(changedOrder);
    a.id = +id;
    await this.updateTotalPriceBeforeUpdate(manager, a);
    await this.stockUpdater.removeStockQuantityBeforeUpdate(manager, a.id);
    const newOrder = await this.orderRepo(manager).save(a, { data: userId });
    await this.stockUpdater.addStockQuantityAfterUpdate(manager, a.id);
    const loaded = await this.orderRepo(manager).findOne(a.id);
    a.totalPrice = loaded.totalPrice;
    return OrderConverter.toDto(await this.orderRepo(manager).save(a, { data: userId }));
  }

  @Delete("/withAll/:id([0-9]+)")
  @Transaction()
  public async deleteWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    await this.stockUpdater.removeStockQuantityBeforeUpdate(manager, +id);
    const extendedOrder = await this.orderRepo(manager).findOne(id, { relations: ["orderItems"] });
    for (const item of extendedOrder.orderItems) {
      await manager.getRepository(OrderItem).remove(item);
    }
    return OrderConverter.toDto(await this.orderRepo(manager).remove(extendedOrder));
  }

  private async updateTotalPriceBeforeUpdate(manager: EntityManager, modifiedOrder: Order) {
    const loadedOrder = await manager.getRepository(Order).findOne(modifiedOrder.id);
    modifiedOrder.totalPrice = loadedOrder.totalPrice;
  }
}
