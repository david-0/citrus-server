import {Authorized, Delete, Get, JsonController, Post, Put} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {OrderItem} from "../entity/OrderItem";

@Authorized("admin")
@JsonController("/api/orderItem")
export class OrderItemController {
  private orderItemRepo: (manager: EntityManager) => Repository<OrderItem>;

  constructor() {
    this.orderItemRepo = manager => manager.getRepository(OrderItem);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") item: OrderItem) {
    return item;
  }

  @Transaction()
  @Get()
  public getAll(@TransactionManager() manager: EntityManager) {
    return this.orderItemRepo(manager).find({
      order: {
        id: "ASC"
      },
    });
  }

  @Transaction()
  @Post()
  public save(@TransactionManager() manager: EntityManager, @EntityFromBody() item: OrderItem) {
    return this.orderItemRepo(manager).save(item);
  }

  @Transaction()
  @Put("/:id([0-9]+)")
  public update(@TransactionManager() manager: EntityManager,
                @EntityFromParam("id") item: OrderItem,
                @EntityFromBody() changedItem: OrderItem) {
    return this.orderItemRepo(manager).save(this.orderItemRepo(manager).merge(item, changedItem));
  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public delete(@TransactionManager() manager: EntityManager, @EntityFromParam("id") item: OrderItem) {
    return this.orderItemRepo(manager).remove(item);
  }
}
