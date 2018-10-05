import {Delete, Get, JsonController, Post} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {CustomerOrder} from "../models/CustomerOrder";

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

  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") order: CustomerOrder) {
    return this.customerOrderRepository.remove(order);
  }
}
