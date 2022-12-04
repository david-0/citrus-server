import { OrderItemDto } from "citrus-common";
import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { OrderItemConverter } from "../converter/OrderItemConverter";
import { OrderItem } from "../entity/OrderItem";

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
    return OrderItemConverter.toDto(await this.orderItemRepo(manager).save(item));
  }

  @Transaction()
  @Put("/:id([0-9]+)")
  public async update(@TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() changedItem: OrderItem): Promise<OrderItemDto> {
    const a = OrderItemConverter.toEntity(changedItem);
    a.id = +id;
    return OrderItemConverter.toDto(await this.orderItemRepo(manager).save(a));
  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<OrderItemDto> {
    const orderItem = new OrderItem();
    orderItem.id = +id;
    return OrderItemConverter.toDto(await this.orderItemRepo(manager).remove(orderItem));
  }
}
