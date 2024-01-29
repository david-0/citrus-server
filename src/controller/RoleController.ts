import { RoleConverter } from "../converter/RoleConverter";
import { Role } from "../entity/Role";
import { Request, Response } from "express";
import { AppDataSource } from "../utils/app-data-source";

export class RoleController {

  private static withUserRelation = ["users"];

  static async get(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const role = await manager.getRepository(Role).findOne({ where: { id: +id } });
      return res.status(200).json(RoleConverter.toDto(role));
    });
  }

  static async getAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const roles = await manager.getRepository(Role).find({
        order: { id: "ASC" },
      });
      return res.status(200).json(RoleConverter.toDtos(roles));
    });
  }

  static async update(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const newRole = RoleConverter.toEntity(req.body);
      const roleRepository = manager.getRepository(Role);
      const loadedRole = await roleRepository.findOne({ where: { id: +id } });
      const mergedRole = roleRepository.merge(loadedRole, newRole);
      const updatedRole = await roleRepository.save(mergedRole);
      return res.status(200).json(RoleConverter.toDto(updatedRole));
    });
  }

  static async save(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const newRole = RoleConverter.toEntity(req.body);
      const savedRole = await manager.getRepository(Role).save(newRole);
      return res.status(200).json(RoleConverter.toDto(savedRole));
    });
  }

  static async delete(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const roleToDelete = new Role();
      roleToDelete.id = +id;
      const deletedRole = await manager.getRepository(Role).remove(roleToDelete);
      return res.status(200).json(RoleConverter.toDto(deletedRole));
    });
  }

  static async getWithUsers(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const role = await manager.getRepository(Role).findOne({
        where: { id: +id },
        relations: RoleController.withUserRelation,
        order: { id: "ASC" },
      });
      return res.status(200).json(RoleConverter.toDto(role));
    });
  }

  static async getAllWithUsers(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const roles = await manager.getRepository(Role).find({
        relations: RoleController.withUserRelation,
        order: { id: "ASC" },
      });
      return res.status(200).json(RoleConverter.toDtos(roles));
    });
  }
}
