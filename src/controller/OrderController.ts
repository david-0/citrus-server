import {Authorized, CurrentUser, Delete, Get, JsonController, Post, Put} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Location} from "../entity/Location";
import {Order} from "../entity/Order";
import {OrderItem} from "../entity/OrderItem";

@Authorized("admin")
@JsonController("/api/order")
export class OrderController {
  private orderRepo: (manager: EntityManager) => Repository<Order>;

  constructor() {
    this.orderRepo = manager => manager.getRepository(Order);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") order: Order) {
    return order;
  }

  @Transaction()
  @Get()
  public getAll(@TransactionManager() manager: EntityManager) {
    return this.orderRepo(manager).find({
        order: {
          id: "ASC"
        },
      }
    );
  }

  @Transaction()
  @Post()
  public save(@CurrentUser({required: true}) userId: number, @TransactionManager() manager: EntityManager, @EntityFromBody() order: Order) {
    return this.orderRepo(manager).save(order, {data: userId});
  }

  @Transaction()
  @Put("/:id([0-9]+)")
  public update(@CurrentUser({required: true}) userId: number,
                @TransactionManager() manager: EntityManager,
                @EntityFromParam("id") order: Order,
                @EntityFromBody() changedOrder: Order) {
    return this.orderRepo(manager).save(this.orderRepo(manager).merge(order, changedOrder), {data: userId});
  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public delete(@TransactionManager() manager: EntityManager,
                @EntityFromParam("id") order: Order) {
    return this.orderRepo(manager).remove(order);
  }

  @Transaction()
  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@TransactionManager() manager: EntityManager, @EntityFromParam("id") order: Order) {
    return this.orderRepo(manager).findOne(order.id, {
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
    });
  }

  @Transaction()
  @Authorized(["sale", "admin"])
  @Get("/openByLocation/:id([0-9]+)")
  public getAllOpenWithUserByLocation(@TransactionManager() manager: EntityManager, @EntityFromParam("id") location: Location) {
    return this.orderRepo(manager)
      .createQueryBuilder("o")
      .leftJoinAndSelect("o.location", "l")
      .leftJoinAndSelect("o.plannedCheckout", "c")
      .where("o.location.id = :id", {id: location.id})
      .andWhere("o.checkedOut = :open", {open: false})
      .orderBy("c.fromDate", "ASC")
      .getMany();
  }

  @Transaction()
  @Get("/withAll")
  public getAllWithAll(@TransactionManager() manager: EntityManager) {
    return this.orderRepo(manager).find({
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
    });
  }

  @Post("/withAll")
  @Transaction()
  public saveWithAll(@CurrentUser({required: true}) userId: number, @TransactionManager() manager: EntityManager, @EntityFromBody() order: Order) {
    return this.orderRepo(manager).save(order, {data: userId});
  }

  @Put("/withAll/:id([0-9]+)")
  @Transaction()
  public updateWithAll(@CurrentUser({required: true}) userId: number,
                       @TransactionManager() manager: EntityManager,
                       @EntityFromParam("id") order: Order,
                       @EntityFromBody() changedOrder: Order) {
    return this.orderRepo(manager).save(this.orderRepo(manager).merge(order, changedOrder), {data: userId});
  }

  @Delete("/withAll/:id([0-9]+)")
  @Transaction()
  public async deleteWithAll(@TransactionManager() manager: EntityManager, @EntityFromParam("id") order: Order) {
    const extendedOrder = await this.orderRepo(manager).findOne(order.id, {relations: ["orderItems"]});
    for (const item of extendedOrder.orderItems) {
      await manager.getRepository(OrderItem).remove(item);
    }
    return await this.orderRepo(manager).remove(order);
  }
}
