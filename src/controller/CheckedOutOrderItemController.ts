import {Authorized, Delete, Get, JsonController, Post, Put} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {CheckedOutOrderItem} from "../entity/CheckedOutOrderItem";

@Authorized("admin")
@JsonController("/api/checkedOutOrderItem")
export class CheckedOutOrderItemController {
  private checkedOutOrderItemRepository: Repository<CheckedOutOrderItem>;

  constructor() {
    this.checkedOutOrderItemRepository = getManager().getRepository(CheckedOutOrderItem);
  }

  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") item: CheckedOutOrderItem) {
    return item;
  }

  @Get()
  public getAll() {
    return this.checkedOutOrderItemRepository.find();
  }

  @Post()
  public save(@EntityFromBody() item: CheckedOutOrderItem) {
    return this.checkedOutOrderItemRepository.save(item);
  }

  @Put("/:id([0-9]+)")
  public update(@EntityFromParam("id") item: CheckedOutOrderItem, @EntityFromBody() changedItem: CheckedOutOrderItem) {
    return this.checkedOutOrderItemRepository.save(this.checkedOutOrderItemRepository.merge(item, changedItem));
  }

  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") item: CheckedOutOrderItem) {
    return this.checkedOutOrderItemRepository.remove(item);
  }
}
