import { OpeningHourConverter } from "../converter/OpeningHourConverter";
import { OpeningHour } from "../entity/OpeningHour";
import { Request, Response } from "express";
import { AppDataSource } from "../utils/app-data-source";

export class OpeningHourController {

  private static withUserRelation = ["users"];

  static async get(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const openinghour = await manager.getRepository(OpeningHour).findOne({ where: { id: +id } });
      return res.status(200).json(OpeningHourConverter.toDto(openinghour));
    });
  }

  static async getAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const openinghours = await manager.getRepository(OpeningHour).find({
        order: { id: "ASC" },
      });
      return res.status(200).json(OpeningHourConverter.toDtos(openinghours));
    });
  }

  static async update(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const newOpeningHour = OpeningHourConverter.toEntity(req.body);
      const openinghourRepository = manager.getRepository(OpeningHour);
      const loadedOpeningHour = await openinghourRepository.findOne({ where: { id: +id } });
      const mergedOpeningHour = openinghourRepository.merge(loadedOpeningHour, newOpeningHour);
      const updatedOpeningHour = await openinghourRepository.save(mergedOpeningHour);
      return res.status(200).json(OpeningHourConverter.toDto(updatedOpeningHour));
    });
  }

  static async save(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const newOpeningHour = OpeningHourConverter.toEntity(req.body);
      const savedOpeningHour = await manager.getRepository(OpeningHour).save(newOpeningHour);
      return res.status(200).json(OpeningHourConverter.toDto(savedOpeningHour));
    });
  }

  static async delete(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const openinghourToDelete = new OpeningHour();
      openinghourToDelete.id = +id;
      const deletedOpeningHour = await manager.getRepository(OpeningHour).remove(openinghourToDelete);
      return res.status(200).json(OpeningHourConverter.toDto(deletedOpeningHour));
    });
  }
}
