import { UserConverter } from "../converter/UserConverter";
import { User } from "../entity/User";
import { Request, Response } from "express";
import { AppDataSource } from "../utils/app-data-source";

export class UserController {

  private static withRoleRelation = ["roles"];
  private static withAllRelations = [
    "roles",
    "orders"];

  static async get(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const user = await manager.getRepository(User).findOne({ where: { id: +id } });
      return res.status(200).json(UserConverter.toDto(user));
    });
  }

  static async getAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const users = await manager.getRepository(User).find({
        order: { id: "ASC" },
      });
      return res.status(200).json(UserConverter.toDtos(users));
    });
  }

  static async update(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const newUser = UserConverter.toEntity(req.body);
      const userRepository = manager.getRepository(User);
      const loadedUser = await userRepository.findOne({ where: { id: +id } });
      const mergedUser = userRepository.merge(loadedUser, newUser);
      delete mergedUser.audits;
      delete mergedUser.orders;
      const updatedUser = await userRepository.save(mergedUser);
      return res.status(200).json(UserConverter.toDto(updatedUser));
    });
  }

  static async save(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const newUser = UserConverter.toEntity(req.body);
      delete newUser.audits;
      delete newUser.orders;
      const savedUser = await manager.getRepository(User).save(newUser);
      return res.status(200).json(UserConverter.toDto(savedUser));
    });
  }

  static async delete(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const userToDelete = new User();
      userToDelete.id = +id;
      delete userToDelete.audits;
      delete userToDelete.orders;
      const deletedUser = await manager.getRepository(User).remove(userToDelete);
      return res.status(200).json(UserConverter.toDto(deletedUser));
    });
  }

  static async deleteWithAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const userToDelete = new User();
      userToDelete.id = +id;
      const deletedUser = await manager.getRepository(User).remove(userToDelete);
      return res.status(200).json(UserConverter.toDto(deletedUser));
    });
  }

  static async getWithRoles(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const user = await manager.getRepository(User).findOne({
        where: { id: +id },
        relations: UserController.withRoleRelation,
        order: { id: "ASC" },
      });
      return res.status(200).json(UserConverter.toDto(user));
    });
  }

  static async getAllWithRoles(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const users = await manager.getRepository(User).find({
        relations: UserController.withRoleRelation,
        order: { id: "ASC" },
      });
      return res.status(200).json(UserConverter.toDtos(users));
    });
  }

  static async getWithAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const user = await manager.getRepository(User).findOne({
        where: { id: +id },
        relations: UserController.withAllRelations,
        order: { id: "ASC" },
      });
      return res.status(200).json(UserConverter.toDto(user));
    });
  }

  static async getAllWithAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const users = await manager.getRepository(User).find({
        relations: UserController.withAllRelations,
        order: { id: "ASC" },
      });
      return res.status(200).json(UserConverter.toDtos(users));
    });
  }
}
