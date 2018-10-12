import {Authorized, Delete, Get, JsonController, Post, Put} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {ArticleStock} from "../models/ArticleStock";
import {CustomerOrder} from "../models/CustomerOrder";

@Authorized()
@JsonController("/api/customerOrder")
export class CustomerOrderController {
  private customerOrderRepository: Repository<CustomerOrder>;

  constructor() {
    this.customerOrderRepository = getManager().getRepository(CustomerOrder);
  }

  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") order: CustomerOrder) {
    return order;
  }

  @Get()
  public getAll() {
    return this.customerOrderRepository.find();
  }

  @Post()
  public save(@EntityFromBody() order: CustomerOrder) {
    return this.customerOrderRepository.save(order);
  }

  @Put("/:id([0-9]+)")
  public update(@EntityFromParam("id") customerOrder: CustomerOrder, @EntityFromBody() changeCustomerOrder: CustomerOrder) {
    return this.customerOrderRepository.save(this.customerOrderRepository.merge(customerOrder, changeCustomerOrder));
  }

  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") order: CustomerOrder) {
    return this.customerOrderRepository.remove(order);
  }

  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@EntityFromParam("id") order: CustomerOrder) {
    return order;
  }

  @Get("/withAll")
  public getAllWithAll() {
    return this.customerOrderRepository.find();
  }

  @Post("/withAll")
  public saveWithAll(@EntityFromBody() order: CustomerOrder) {
    return this.customerOrderRepository.save(order);
  }

  @Put("/withAll/:id([0-9]+)")
  public updateWithAll(@EntityFromParam("id") customerOrder: CustomerOrder, @EntityFromBody() changeCustomerOrder: CustomerOrder) {
    return this.customerOrderRepository.save(this.customerOrderRepository.merge(customerOrder, changeCustomerOrder));
  }

  @Delete("/withAll/:id([0-9]+)")
  public deleteWithAll(@EntityFromParam("id") order: CustomerOrder) {
    return this.customerOrderRepository.remove(order);
  }
}
