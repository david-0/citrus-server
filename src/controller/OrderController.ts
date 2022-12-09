import { OrderDto } from "citrus-common";
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { OrderConverter } from "../converter/OrderConverter";
import { Location } from "../entity/Location";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";

@Authorized("admin")
@JsonController("/api/order")
export class OrderController {
  private orderRepo: (manager: EntityManager) => Repository<Order>;

  constructor() {
    this.orderRepo = manager => manager.getRepository(Order);
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
    const order = OrderConverter.toEntity(newOrder);
    return OrderConverter.toDto(await this.orderRepo(manager).save(order, { data: userId }));
  }

  @Transaction()
  @Put("/:id([0-9]+)")
  public async update(@CurrentUser({ required: true }) userId: number, @TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() changedOrder: Order): Promise<OrderDto> {
    const order = OrderConverter.toEntity(changedOrder);
    order.id = +id;
    return OrderConverter.toDto(await this.orderRepo(manager).save(order, { data: userId }));
  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<OrderDto> {
    const order = new Order();
    order.id = +id;
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
        "checkingOutUser",
      ],
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Authorized(["sale", "admin"])
  @Get("/openByLocation/:id([0-9]+)")
  public async getAllOpenWithUserByLocation(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<OrderDto[]> {
    return OrderConverter.toDtos(await this.orderRepo(manager)
      .createQueryBuilder("o")
      .leftJoinAndSelect("o.location", "l")
      .leftJoinAndSelect("o.plannedCheckout", "c")
      .where("o.location.id = :id", { id: +id })
      .andWhere("o.checkedOut = :open", { open: false })
      .orderBy("c.fromDate", "ASC")
      .getMany());
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
        "checkingOutUser",
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
    const order = OrderConverter.toEntity(newOrder);
    return OrderConverter.toDto(await this.orderRepo(manager).save(order, { data: userId }));
  }

  @Put("/withAll/:id([0-9]+)")
  @Transaction()
  public async updateWithAll(@CurrentUser({ required: true }) userId: number, @TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() changedOrder: Order): Promise<OrderDto> {
    const a = OrderConverter.toEntity(changedOrder);
    const loaded = await this.orderRepo(manager).findOne(id);
    a.id = +id;
    a.totalPrice = loaded.totalPrice;
    return OrderConverter.toDto(await this.orderRepo(manager).save(a, { data: userId }));
  }

  @Delete("/withAll/:id([0-9]+)")
  @Transaction()
  public async deleteWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    const extendedOrder = await this.orderRepo(manager).findOne(id, { relations: ["orderItems"] });
    for (const item of extendedOrder.orderItems) {
      await manager.getRepository(OrderItem).remove(item);
    }
    return OrderConverter.toDto(await this.orderRepo(manager).remove(extendedOrder));
  }
}
