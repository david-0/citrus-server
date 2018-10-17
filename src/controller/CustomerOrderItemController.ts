import {Authorized, Delete, Get, JsonController, Post} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {OrderItem} from "../entity/OrderItem";
import {Role} from "../entity/Role";

@Authorized()
@JsonController("/api/customerOrderItem")
export class CustomerOrderItemController {
  private customerOrderItemRepository: Repository<OrderItem>;

  constructor() {
    this.customerOrderItemRepository = getManager().getRepository(OrderItem);
  }

  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") item: OrderItem) {
    return item;
  }

  @Get()
  public getAll() {
    return this.customerOrderItemRepository.find();
  }

  @Post()
  public save(@EntityFromBody() item: OrderItem) {
    return this.customerOrderItemRepository.save(item);
  }

  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") item: OrderItem) {
    return this.customerOrderItemRepository.remove(item);
  }
}
