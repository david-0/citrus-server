import {Authorized, Delete, Get, JsonController, Post, Put} from "routing-controllers";
import {EntityManager, getManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Order} from "../entity/Order";
import {OrderItem} from "../entity/OrderItem";

@Authorized("admin")
@JsonController("/api/order")
export class CustomerOrderController {
  private customerOrderRepository: Repository<Order>;

  constructor() {
    this.customerOrderRepository = getManager().getRepository(Order);
  }

  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") order: Order) {
    return order;
  }

  @Get()
  public getAll() {
    return this.customerOrderRepository.find();
  }

  @Post()
  public save(@EntityFromBody() order: Order) {
    return this.customerOrderRepository.save(order);
  }

  @Put("/:id([0-9]+)")
  public update(@EntityFromParam("id") customerOrder: Order, @EntityFromBody() changeCustomerOrder: Order) {
    return this.customerOrderRepository.save(this.customerOrderRepository.merge(customerOrder, changeCustomerOrder));
  }

  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") order: Order) {
    return this.customerOrderRepository.remove(order);
  }

  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@EntityFromParam("id") order: Order) {
    return this.customerOrderRepository.findOne(order.id, {
      relations: [
        "user",
        "location",
        "location.openingHours",
        "orderItems",
        "orderItems.article",
        "orderItems.article.unitOfMeasurement",
        "plannedCheckout",
        "checkingOutUser",
      ],
    });
  }

  @Get("/withAll")
  public getAllWithAll() {
    return this.customerOrderRepository.find({
      relations: [
        "user",
        "location",
        "location.openingHours",
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
                       @EntityFromParam("id") customerOrder: Order,
                       @EntityFromBody() changeCustomerOrder: Order) {
    return manager.getRepository(Order).save(manager.getRepository(Order).merge(customerOrder, changeCustomerOrder));
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
