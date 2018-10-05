import {Authorized, Delete, Get, JsonController, Post} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {CustomerOrderItem} from "../models/CustomerOrderItem";
import {Role} from "../models/Role";

@Authorized()
@JsonController("/api/customerOrderItem")
export class CustomerOrderItemController {
  private customerOrderItemRepository: Repository<CustomerOrderItem>;

  constructor() {
    this.customerOrderItemRepository = getManager().getRepository(CustomerOrderItem);
  }

  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") item: CustomerOrderItem) {
    return item;
  }

  @Get()
  public getAll() {
    return this.customerOrderItemRepository.find();
  }

  @Post()
  public save(@EntityFromBody() item: CustomerOrderItem) {
    return this.customerOrderItemRepository.save(item);
  }

  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") item: CustomerOrderItem) {
    return this.customerOrderItemRepository.remove(item);
  }
}
