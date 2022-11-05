import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import { MessageTemplate } from "../entity/MessageTemplate";

@JsonController("/api/messageTemplate")
export class MessageTemplateController {
  private messageTemplateRepo: (manager: EntityManager) => Repository<MessageTemplate>;

  constructor() {
    this.messageTemplateRepo = manager => manager.getRepository(MessageTemplate);
  }

  @Transaction()
  @Authorized("admin")
  @Get("/:id([0-9]+)")
  public get(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    const t = this.messageTemplateRepo(manager).findOne(id);
    return t;
  }

  @Transaction()
  @Authorized("admin")
  @Post()
  public save(@TransactionManager() manager: EntityManager, @EntityFromBody() messageTemplate: MessageTemplate) {
    return this.messageTemplateRepo(manager).save(messageTemplate);
  }

  @Transaction()
  @Put("/:id([0-9]+)")
  public update(@TransactionManager() manager: EntityManager,
                @EntityFromParam("id") messageTemplte: MessageTemplate,
                @EntityFromBody() newMessageTemplate: MessageTemplate) {
    return this.messageTemplateRepo(manager).save(this.messageTemplateRepo(manager).merge(messageTemplte, newMessageTemplate));
  }

  @Transaction()
  @Get()
  public getAll(@TransactionManager() manager: EntityManager) {
    return this.messageTemplateRepo(manager).find({
      order: {
        id: "ASC"
      },
    });
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/:id([0-9]+)")
  public delete(@TransactionManager() manager: EntityManager, @EntityFromParam("id") messageTemplate: MessageTemplate) {
    return this.messageTemplateRepo(manager).remove(messageTemplate);
  }
}
