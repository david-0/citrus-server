import {CartDto} from "citrus-common";
import {Request} from "express";
import {Authorized, Body, JsonController, Post, Req} from "routing-controllers";
import {EntityManager, Transaction, TransactionManager} from "typeorm";
import {ArticleStock} from "../entity/ArticleStock";
import {Order} from "../entity/Order";
import {OrderItem} from "../entity/OrderItem";
import {User} from "../entity/User";

@Authorized()
@JsonController("/api/cart")
export class CartController {

  @Post()
  @Transaction()
  public async save(@TransactionManager() manager: EntityManager, @Body() cartDto: CartDto, @Req() request: Request): Promise<Order> {
    const user: User = await manager.getRepository(User).findOne(request.user.id);
    const customerOrder = new Order();
    customerOrder.user = user;
    for (const cartEntry of cartDto.cartEntries) {
      const articleStock = await manager.getRepository(ArticleStock).findOne(cartEntry.articleStockId);
      const item = new OrderItem();
      item.order = customerOrder;
      item.articleStock = articleStock;
      item.quantity = cartEntry.quantity;
      customerOrder.orderLocations.push(item);
    }
    customerOrder.totalPrice = this.computeTotalPrice(customerOrder);
    return await manager.getRepository(Order).save(customerOrder);
  }

  private computeTotalPrice(customerOrder: Order) {
    return customerOrder.orderLocations
      .map(item => +item.copiedPrice * +item.quantity)
      .reduce((p, c) => p + c, 0);
  }
}
