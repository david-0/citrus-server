import { MessageTemplateConverter } from "../converter/MessageTemplateConverter";
import { MessageTemplate } from "../entity/MessageTemplate";
import { Request, Response } from "express";
import { AppDataSource } from "../utils/app-data-source";

export class MessageTemplateController {

  private static withUserRelation = ["users"];

  static async get(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const messagetemplate = await manager.getRepository(MessageTemplate).findOne({ where: { id: +id } });
      return res.status(200).json(MessageTemplateConverter.toDto(messagetemplate));
    });
  }

  static async getAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const messagetemplates = await manager.getRepository(MessageTemplate).find({
        order: { id: "ASC" },
      });
      return res.status(200).json(MessageTemplateConverter.toDtos(messagetemplates));
    });
  }

  static async update(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const newMessageTemplate = MessageTemplateConverter.toEntity(req.body);
      const messagetemplateRepository = manager.getRepository(MessageTemplate);
      const loadedMessageTemplate = await messagetemplateRepository.findOne({ where: { id: +id } });
      const mergedMessageTemplate = messagetemplateRepository.merge(loadedMessageTemplate, newMessageTemplate);
      const updatedMessageTemplate = await messagetemplateRepository.save(mergedMessageTemplate);
      return res.status(200).json(MessageTemplateConverter.toDto(updatedMessageTemplate));
    });
  }

  static async save(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const newMessageTemplate = MessageTemplateConverter.toEntity(req.body);
      const savedMessageTemplate = await manager.getRepository(MessageTemplate).save(newMessageTemplate);
      return res.status(200).json(MessageTemplateConverter.toDto(savedMessageTemplate));
    });
  }

  static async delete(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const messagetemplateToDelete = new MessageTemplate();
      messagetemplateToDelete.id = +id;
      const deletedMessageTemplate = await manager.getRepository(MessageTemplate).remove(messagetemplateToDelete);
      return res.status(200).json(MessageTemplateConverter.toDto(deletedMessageTemplate));
    });
  }
}
