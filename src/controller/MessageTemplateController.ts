import { MessageTemplateDto } from "citrus-common";
import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { MessageTemplateConverter } from "../converter/MessageTemplateConverter";
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
  public async get(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<MessageTemplateDto> {
    return MessageTemplateConverter.toDto(await this.messageTemplateRepo(manager).findOne(id));
  }

  @Transaction()
  @Authorized("admin")
  @Post()
  public async save(@TransactionManager() manager: EntityManager, @Body() messageTemplate: MessageTemplate): Promise<MessageTemplateDto> {
    const m = MessageTemplateConverter.toEntity(messageTemplate);
    return MessageTemplateConverter.toDto(await this.messageTemplateRepo(manager).save(m));
  }

  @Transaction()
  @Put("/:id([0-9]+)")
  public async update(@TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() newMessageTemplate: MessageTemplate): Promise<MessageTemplateDto> {
    const a = MessageTemplateConverter.toEntity(newMessageTemplate);
    a.id = +id;
    return MessageTemplateConverter.toDto(await this.messageTemplateRepo(manager).save(a));
  }

  @Transaction()
  @Get()
  public async getAll(@TransactionManager() manager: EntityManager): Promise<MessageTemplateDto[]> {
    return MessageTemplateConverter.toDtos(await this.messageTemplateRepo(manager).find({
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    const messageTemplate = new MessageTemplate();
    messageTemplate.id = +id;
    return MessageTemplateConverter.toDto(await this.messageTemplateRepo(manager).remove(messageTemplate));
  }
}
