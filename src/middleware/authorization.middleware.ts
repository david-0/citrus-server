import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../utils/app-data-source";

export const authorization = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    return await AppDataSource.transaction(async (manager) => {
      const user = req["currentUser"];
      if (!(user && (!roles.length ||
        roles.filter(role => user.roles.indexOf(role) !== -1).length > 0))) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    });
  };
};