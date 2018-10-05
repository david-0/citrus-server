import {CartDto} from "citrus-common";
import {Request} from "express";
import {Authorized, Body, JsonController, Post, Req} from "routing-controllers";
import {EntityManager, Transaction, TransactionManager} from "typeorm";
import {ArticleStock} from "../models/ArticleStock";
import {CustomerOrder} from "../models/CustomerOrder";
import {CustomerOrderItem} from "../models/CustomerOrderItem";
import {User} from "../models/User";

@Authorized()
@JsonController("/api/cart")
export class CartController {

  @Post()
  @Transaction()
  public async save(@TransactionManager() manager: EntityManager, @Body() cartDto: CartDto, @Req() request: Request): Promise<CustomerOrder> {
    const user: User = await manager.getRepository(User).findOne(request.user.id);
    const customerOrder = new CustomerOrder();
    customerOrder.user = user;
    for (const cartEntry of cartDto.cartEntries) {
      const articleStock = await manager.getRepository(ArticleStock).findOne(cartEntry.articleStockId);
      const item = new CustomerOrderItem();
      item.customerOrder = customerOrder;
      item.articleStock = articleStock;
      item.quantity = cartEntry.quantity;
      customerOrder.customerOrderItems.push(item);
    }
    customerOrder.totalPrice = this.computeTotalPrice(customerOrder);
    return await manager.getRepository(CustomerOrder).save(customerOrder);
  }

  private computeTotalPrice(customerOrder: CustomerOrder) {
    return customerOrder.customerOrderItems
      .map(item => +item.copiedPrice * +item.quantity)
      .reduce((p, c) => p + c, 0);
  }
}
