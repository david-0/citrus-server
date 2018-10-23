import {Authorized, Delete, Get, JsonController, Post, Put} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Order} from "../entity/Order";

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
    return this.customerOrderRepository.findOne(order.id, {relations: ["user", "location", "orderItems", "plannedCheckout", "checkingOutUser"]});
  }

  @Get("/withAll")
  public getAllWithAll() {
    return this.customerOrderRepository.find({relations: ["user", "location", "orderItems", "plannedCheckout", "checkingOutUser"]});
  }

  @Post("/withAll")
  public saveWithAll(@EntityFromBody() order: Order) {
    return this.customerOrderRepository.save(order);
  }

  @Put("/withAll/:id([0-9]+)")
  public updateWithAll(@EntityFromParam("id") customerOrder: Order, @EntityFromBody() changeCustomerOrder: Order) {
    return this.customerOrderRepository.save(this.customerOrderRepository.merge(customerOrder, changeCustomerOrder));
  }

  @Delete("/withAll/:id([0-9]+)")
  public deleteWithAll(@EntityFromParam("id") order: Order) {
    return this.customerOrderRepository.remove(order);
  }
}
