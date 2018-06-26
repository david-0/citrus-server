import express = require("express");
import {Transaction} from "sequelize";

export interface ITransactionController {
  add(req: express.Request, res: express.Response, transaction: Transaction): Promise<void>;
  getAll(req: express.Request, res: express.Response, transaction: Transaction): Promise<void>;
  get(req: express.Request, res: express.Response, transaction: Transaction): Promise<void>;
  del(req: express.Request, res: express.Response, transaction: Transaction): Promise<void>;
  update(req: express.Request, res: express.Response, transaction: Transaction): Promise<void>;
}
