import {Authorized, Delete, Get, JsonController, Post, Put} from "routing-controllers";
import {EntityManager, getManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Location} from "../entity/Location";
import {Order} from "../entity/Order";
import {OrderItem} from "../entity/OrderItem";

@Authorized("admin")
@JsonController("/api/order")
export class OrderController {
  private orderRepository: Repository<Order>;

  constructor() {
    this.orderRepository = getManager().getRepository(Order);
  }

  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") order: Order) {
    return order;
  }

  @Get()
  public getAll() {
    return this.orderRepository.find();
  }

  @Post()
  public save(@EntityFromBody() order: Order) {
    return this.orderRepository.save(order);
  }

  @Put("/:id([0-9]+)")
  public update(@EntityFromParam("id") order: Order, @EntityFromBody() changedOrder: Order) {
    return this.orderRepository.save(this.orderRepository.merge(order, changedOrder));
  }

  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") order: Order) {
    return this.orderRepository.remove(order);
  }

  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@EntityFromParam("id") order: Order) {
    return this.orderRepository.findOne(order.id, {
      relations: [
        "user",
        "location",
        "orderItems",
        "orderItems.article",
        "orderItems.article.unitOfMeasurement",
        "plannedCheckout",
        "checkingOutUser",
      ],
    });
  }

  @Authorized(["sale", "admin"])
  @Get("/byLocation/:id([0-9]+)")
  public getAllWithUserByLocation(@EntityFromParam("id") location: Location) {
    return this.orderRepository.find({
      relations: [
        "user",
        "plannedCheckout",
      ],
      where: {location, checkedOut: false},
    });
  }

  @Get("/withAll")
  public getAllWithAll() {
    return this.orderRepository.find({
      relations: [
        "user",
        "location",
        "orderItems",
        "orderItems.article",
        "orderItems.article.unitOfMeasurement",
        "plannedCheckout",
        "checkingOutUser",
      ],
    });
  }

  @Post("/withAll")
  @Transaction()
  public saveWithAll(@TransactionManager() manager: EntityManager, @EntityFromBody() order: Order) {
    return manager.getRepository(Order).save(order);
  }

  @Put("/withAll/:id([0-9]+)")
  @Transaction()
  public updateWithAll(@TransactionManager() manager: EntityManager,
                       @EntityFromParam("id") order: Order,
                       @EntityFromBody() changedOrder: Order) {
    return manager.getRepository(Order).save(manager.getRepository(Order).merge(order, changedOrder));
  }

  @Delete("/withAll/:id([0-9]+)")
  @Transaction()
  public async deleteWithAll(@TransactionManager() manager: EntityManager, @EntityFromParam("id") order: Order) {
    const extendedOrder = await manager.getRepository(Order).findOne(order.id, {relations: ["orderItems"]});
    for (const item of extendedOrder.orderItems) {
      await manager.getRepository(OrderItem).remove(item);
    }
    return await manager.getRepository(Order).remove(order);
  }
}
