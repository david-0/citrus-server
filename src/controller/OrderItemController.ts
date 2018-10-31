import {Authorized, Delete, Get, JsonController, Post, Put} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {OrderItem} from "../entity/OrderItem";

@Authorized("admin")
@JsonController("/api/orderItem")
export class OrderItemController {
  private orderItemRepository: Repository<OrderItem>;

  constructor() {
    this.orderItemRepository = getManager().getRepository(OrderItem);
  }

  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") item: OrderItem) {
    return item;
  }

  @Get()
  public getAll() {
    return this.orderItemRepository.find();
  }

  @Post()
  public save(@EntityFromBody() item: OrderItem) {
    return this.orderItemRepository.save(item);
  }

  @Put("/:id([0-9]+)")
  public update(@EntityFromParam("id") item: OrderItem, @EntityFromBody() changedItem: OrderItem) {
    return this.orderItemRepository.save(this.orderItemRepository.merge(item, changedItem));
  }


  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") item: OrderItem) {
    return this.orderItemRepository.remove(item);
  }
}
