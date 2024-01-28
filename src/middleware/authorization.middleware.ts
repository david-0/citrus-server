import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../utils/app-data-source";
import { User } from "../entity/User";

export const authorization = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    return await AppDataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const user = await userRepo.findOne({
        where: { id: req["currentUser"].id },
        relations: ["roles"],
      });
      if (!(user && (!roles.length ||
        roles.filter(role => user.roles.map(r => r.name).indexOf(role) !== -1).length > 0))) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    });
  };
};