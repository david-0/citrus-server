import { UnitOfMeasurementConverter } from "../converter/UnitOfMeasurementConverter";
import { UnitOfMeasurement } from "../entity/UnitOfMeasurement";
import { Request, Response } from "express";
import { AppDataSource } from "../utils/app-data-source";

export class UnitOfMeasurementController {
  private static withArticleRelation = ["articles"];

  static async get(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const unitofmeasurement = await manager.getRepository(UnitOfMeasurement).findOne({ where: { id: +id } });
      return res.status(200).json(UnitOfMeasurementConverter.toDto(unitofmeasurement));
    });
  }

  static async getAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const unitofmeasurements = await manager.getRepository(UnitOfMeasurement).find({
        order: { id: "ASC" },
      });
      return res.status(200).json(UnitOfMeasurementConverter.toDtos(unitofmeasurements));
    });
  }

  static async update(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const newUnitOfMeasurement = UnitOfMeasurementConverter.toEntity(req.body);
      const unitofmeasurementRepository = manager.getRepository(UnitOfMeasurement);
      const loadedUnitOfMeasurement = await unitofmeasurementRepository.findOne({ where: { id: +id } });
      const mergedUnitOfMeasurement = unitofmeasurementRepository.merge(loadedUnitOfMeasurement, newUnitOfMeasurement);
      const updatedUnitOfMeasurement = await unitofmeasurementRepository.save(mergedUnitOfMeasurement);
      return res.status(200).json(UnitOfMeasurementConverter.toDto(updatedUnitOfMeasurement));
    });
  }

  static async save(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const newUnitOfMeasurement = UnitOfMeasurementConverter.toEntity(req.body);
      const savedUnitOfMeasurement = await manager.getRepository(UnitOfMeasurement).save(newUnitOfMeasurement);
      return res.status(200).json(UnitOfMeasurementConverter.toDto(savedUnitOfMeasurement));
    });
  }

  static async delete(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const unitofmeasurementToDelete = new UnitOfMeasurement();
      unitofmeasurementToDelete.id = +id;
      const deletedUnitOfMeasurement = await manager.getRepository(UnitOfMeasurement).remove(unitofmeasurementToDelete);
      return res.status(200).json(UnitOfMeasurementConverter.toDto(deletedUnitOfMeasurement));
    });
  }

  static async getWithArticles(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const unitofmeasurement = await manager.getRepository(UnitOfMeasurement).findOne({
        where: { id: +id },
        relations: UnitOfMeasurementController.withArticleRelation,
        order: { id: "ASC" },
      });
      return res.status(200).json(UnitOfMeasurementConverter.toDto(unitofmeasurement));
    });
  }

  static async getAllWithArticles(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const unitofmeasurements = await manager.getRepository(UnitOfMeasurement).find({
        relations: UnitOfMeasurementController.withArticleRelation,
        order: { id: "ASC" },
      });
      return res.status(200).json(UnitOfMeasurementConverter.toDtos(unitofmeasurements));
    });
  }
}
