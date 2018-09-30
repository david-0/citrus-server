import * as express from "express";
import {Model, Sequelize} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {Transaction} from "sequelize-typescript/node_modules/@types/sequelize";
import {IController} from "./IController";
import {ITransactionController} from "./ITransactionController";

export class TransactionController<T extends Model<T>> implements IController {

  constructor(private sequelize: Sequelize, private controller: ITransactionController) {
  }

  public add(req: express.Request, res: express.Response): void {
    return this.wrapperTransaction(req, res, (rx, tr, transaction) => this.controller.add(rx, tr, transaction));
  }

  public getAll(req: express.Request, res: express.Response): void {
    return this.wrapperTransaction(req, res, (rx, tr, transaction) => this.controller.getAll(rx, tr, transaction));
  }

  public get(req: express.Request, res: express.Response): void {
    return this.wrapperTransaction(req, res, (rx, tr, transaction) => this.controller.get(rx, tr, transaction));
  }

  public del(req: express.Request, res: express.Response): void {
    return this.wrapperTransaction(req, res, (rx, tr, transaction) => this.controller.del(rx, tr, transaction));
  }

  public update(req: express.Request, res: express.Response): void {
    return this.wrapperTransaction(req, res, (rx, tr, transaction) => this.controller.update(rx, tr, transaction));
  }

  private wrapperTransaction(req: express.Request,
                             res: express.Response,
                             callback: (req: express.Request,
                                        res: express.Response,
                                        transaction: Transaction) => Promise<void>): void {
    this.sequelize.transaction().then((transaction) => {
      callback(req, res, transaction).then(() => {
        if (res.statusCode < 500) {
          transaction.commit();
        } else {
          transaction.rollback();
        }
      }).catch((error) => {
        res.status(404).json({error: `error in transaction handling: ${error}, ${error.stack}`});
      });
    }).catch((error: TypeError) => {
      res.status(404).json({error: `error in transaction handling: ${error}, ${error.stack}`});
    });
  }
}
