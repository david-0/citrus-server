import { LocationConverter } from "../converter/LocationConverter";
import { Location } from "../entity/Location";
import { OpeningHour } from "../entity/OpeningHour";
import { Request, Response } from "express";
import { AppDataSource } from "../utils/app-data-source";

export class LocationController {

  private static withOpeningHourRelation = ["openingHours"];
  private static withAllRelations = ["articleStocks", "openingHours"];

  static async get(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const location = await manager.getRepository(Location).findOne({ where: { id: +id } });
      return res.status(200).json(LocationConverter.toDto(location));
    });
  }

  static async getAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const locations = await manager.getRepository(Location).find({
        order: { id: "ASC" },
      });
      return res.status(200).json(LocationConverter.toDtos(locations));
    });
  }

  static async update(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const newLocation = LocationConverter.toEntity(req.body);
      const locationRepository = manager.getRepository(Location);
      const loadedLocation = await locationRepository.findOne({ where: { id: +id } });
      const mergedLocation = locationRepository.merge(loadedLocation, newLocation);
      const updatedLocation = await locationRepository.save(mergedLocation);
      return res.status(200).json(LocationConverter.toDto(updatedLocation));
    });
  }

  static async save(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const newLocation = LocationConverter.toEntity(req.body);
      const savedLocation = await manager.getRepository(Location).save(newLocation);
      return res.status(200).json(LocationConverter.toDto(savedLocation));
    });
  }

  static async delete(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const locationToDelete = await manager.getRepository(Location).findOne({
        where: { id: +id },
        relations: ["openingHours"]
      });
      for (const item of locationToDelete.openingHours) {
        await manager.getRepository(OpeningHour).remove(item);
      }
      const deletedLocation = await manager.getRepository(Location).remove(locationToDelete);
      return res.status(200).json(LocationConverter.toDto(deletedLocation));
    });
  }

  static async getWithOpeningHours(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const location = await manager.getRepository(Location).findOne({
        where: { id: +id },
        relations: LocationController.withOpeningHourRelation
      });
      return res.status(200).json(LocationConverter.toDto(location));
    });
  }

  static async getAllWithOpeningHours(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const locations = await manager.getRepository(Location).createQueryBuilder("l")
        .leftJoinAndSelect("l.openingHours", "o")
        .orderBy({ "o.fromDate": "ASC" })
        .getMany();
      return res.status(200).json(LocationConverter.toDtos(locations));
    });
  }


  static async getAllWithOpeningHoursStocksAndArticle(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const locations = await manager.getRepository(Location).createQueryBuilder("l")
        .leftJoinAndSelect("l.openingHours", "o")
        .leftJoinAndSelect("l.articleStocks", "s")
        .leftJoinAndSelect("s.article", "a")
        .orderBy({ "o.fromDate": "ASC" })
        .getMany();
      return res.status(200).json(LocationConverter.toDtos(locations));
    });
  }

  static async getWithAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const location = await manager.getRepository(Location).findOne({
        where: { id: +id },
        relations: LocationController.withAllRelations,
      });
      return res.status(200).json(LocationConverter.toDto(location));
    });
  }

  static async getAllWithAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const locations = await manager.getRepository(Location).find({
        order: { id: "ASC" },
        relations: LocationController.withAllRelations,
      });
      return res.status(200).json(LocationConverter.toDtos(locations));
    });
  }
}
