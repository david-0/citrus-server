import { ArticleInventoryTransferDto } from "citrus-common";
import { Authorized, Body, JsonController, Post } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { ArticleCheckIn } from "../entity/ArticleCheckIn";
import { ArticleStock } from "../entity/ArticleStock";

@JsonController("/api/articleInventoryTransfer")
export class ArticleInventoryTransferController {
  private articleCheckInRepo: (manager: EntityManager) => Repository<ArticleCheckIn>;
  private articleStockRepo: (manager: EntityManager) => Repository<ArticleStock>;

  constructor() {
    this.articleCheckInRepo = manager => manager.getRepository(ArticleCheckIn);
    this.articleStockRepo = manager => manager.getRepository(ArticleStock);
  }

  @Transaction()
  @Authorized("admin")
  @Post("/transfer")
  public async transfer(@TransactionManager() manager: EntityManager, @Body() transfer: ArticleInventoryTransferDto): Promise<String> {
    return new Promise<String>(async (resolve, reject) => {
      ArticleInventoryTransferDto
      const checkInSender = await this.articleCheckInRepo(manager)
        .createQueryBuilder("checkInSender")
        .leftJoinAndSelect("checkInSender.articleStock", "stock")
        .where("stock.id = :id", { id: transfer.articleStockSenderId })
        .getOne();
      if (checkInSender === null || checkInSender === undefined) {
        const senderArticleStock = await this.articleStockRepo(manager).findOne(transfer.articleStockSenderId, {
          relations: [
            "article",
            "location",
          ],
        });
        reject("Keine Einbuchung für " + senderArticleStock.article.description + " in " + senderArticleStock.location.description + " vorhanden. Umbuchung abgebrochen.");
        return;
      }
      const checkInReceiver = await this.articleCheckInRepo(manager)
        .createQueryBuilder("checkInReceiver")
        .leftJoinAndSelect("checkInReceiver.articleStock", "stock")
        .where("stock.id = :id", { id: transfer.articleStockReceiverId })
        .getOne();
      if (checkInReceiver === null || checkInReceiver === undefined) {
        const receiverArticleStock = await this.articleStockRepo(manager).findOne(transfer.articleStockSenderId, {
          relations: [
            "article",
            "location",
          ],
        });
        reject("Keine Einbuchung für " + receiverArticleStock.article.description + " in " + receiverArticleStock.location.description + " vorhanden. Umbuchung abgebrochen.");
        return;
      }
      checkInSender.quantity = checkInSender.quantity - +transfer.quantity;
      checkInReceiver.quantity = checkInReceiver.quantity + +transfer.quantity;
      await this.articleCheckInRepo(manager).save(checkInSender);
      await this.articleCheckInRepo(manager).save(checkInReceiver);
      resolve("saved");
    });
  }
}
