import {CartDto} from "citrus-common";
import {Request} from "express";
import {Authorized, Body, CurrentUser, JsonController, Post, Req} from "routing-controllers";
import {EntityManager, Transaction, TransactionManager} from "typeorm";
import {ArticleStock} from "../entity/ArticleStock";
import {Location} from "../entity/Location";
import {OpeningHour} from "../entity/OpeningHour";
import {Order} from "../entity/Order";
import {OrderItem} from "../entity/OrderItem";
import {OrderLocation} from "../entity/OrderLocation";
import {User} from "../entity/User";

@Authorized()
@JsonController("/api/cart")
export class CartController {

  @Post()
  @Transaction()
  public async save(@CurrentUser({required: true}) userId: number,
                    @TransactionManager() manager: EntityManager,
                    @Body() cartDto: CartDto,
                    @Req() request: Request): Promise<Order> {
    const user: User = await manager.getRepository(User).findOne(userId);
    const order = new Order();
    order.date = new Date();
    order.user = user;
    order.completed = false;
    order.orderLocations = [];
    for (const cartLocation of cartDto.cartLocations) {
      const orderLocation = new OrderLocation();
      orderLocation.orderItems = [];
      orderLocation.checkedOut = false;
      orderLocation.location = await manager.getRepository(Location).findOne(cartLocation.location.id);
      if (cartLocation.openingHourOfPlannedCheckout) {
        orderLocation.plannedCheckout = await manager.getRepository(OpeningHour).findOne(cartLocation.openingHourOfPlannedCheckout.id);
      }
      for (const cartItem of cartLocation.cartItems) {
        const articleStock = await manager.getRepository(ArticleStock)
          .find({
            where:
              {
                article: {id: cartItem.article.id},
                location: {id: cartLocation.location.id},
              },
          });
        if (articleStock.length === 1) {
          const item = new OrderItem();
          item.articleStock = articleStock[0];
//          item.orderLocation = orderLocation;
          item.copiedPrice = cartItem.price;
          item.quantity = cartItem.quantity;
          orderLocation.orderItems.push(item);
        } else {
          throw new Error(`Article (id: ${cartItem.article.id} at location (id: ${cartLocation.location.id}) not available.`);
        }
      }
      order.orderLocations.push(orderLocation);
    }
    order.totalPrice = this.computeTotalPrice(order);
    return await manager.getRepository(Order).save(order);
  }

  private computeTotalPrice(order: Order) {
    let totalPrice = 0;
    order.orderLocations.forEach(l => {
      let totalLocationPrice = 0;
      l.orderItems.forEach(i => {
        totalLocationPrice += +i.copiedPrice * +i.quantity;
      });
      l.totalLocationPrice = totalLocationPrice;
      totalPrice += totalLocationPrice;
    });
    return totalPrice;
  }
}
