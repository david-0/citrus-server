import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AppJwtConfiguration } from "../utils/app-jwt-configuration";

export const authentification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decode = jwt.verify(token, AppJwtConfiguration.signSecret);
  if (!decode) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req["currentUser"] = decode;
  next();
};