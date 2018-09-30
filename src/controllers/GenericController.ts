import * as express from "express";
import {Logger} from "log4js";
import {Model} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {Transaction} from "sequelize-typescript/node_modules/@types/sequelize";
import {IModelWrapper} from "./IModelWrapper";
import {ITransactionController} from "./ITransactionController";
import log4js = require("log4js");

let LOGGER: Logger = log4js.getLogger("GenericController");

export class GenericController<T extends Model<T>> implements ITransactionController {

  constructor(private wrapper: IModelWrapper<T>) {
    LOGGER = log4js.getLogger(`GenericController-${wrapper.name}`);
  }

  public add(req: express.Request, res: express.Response, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const instance = req.body;
      LOGGER.debug(`create ${this.wrapper.name()}: ${JSON.stringify(instance)}`);
      this.wrapper.create(instance, transaction)
        .then((created: T) => {
          LOGGER.debug(`created ${this.wrapper.name()}. successfully, id: ${created.id}`);
          res.status(201).json(created);
          resolve();
        })
        .catch((err) => {
          res.status(500).json({error: `error creating ${this.wrapper.name()} ${instance.id}. ${err}`});
          LOGGER.error("Unable to connect to the database:", err);
          reject(err);
        });
    });
  }

  public getAll(req: express.Request, res: express.Response, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.wrapper.findAll(transaction).then((items) => {
        res.json(items);
        resolve();
      }).catch((err) => {
        res.status(404).json({error: `error retrieving all ${this.wrapper.name()}s. ${err}`});
        reject(err);
      });
    });
  }

  public get(req: express.Request, res: express.Response, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.wrapper.findById(req.params.id, transaction).then((item) => {
        res.json(item);
        resolve();
      }).catch((err) => {
        res.status(404).json({error: `error retrieving ${this.wrapper.name()}. ${err}`});
        reject(err);
      });
    });
  }

  public del(req: express.Request, res: express.Response, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.wrapper.findById(req.params.id, transaction).then((item) => {
        this.wrapper.delete(item, transaction).then(() => {
          res.json(true);
          resolve();
        }).catch((err) => {
          res.status(404).json({error: `error could not delete ${this.wrapper.name()}. ${err}`});
          reject(err);
        });
      }).catch((err) => {
        res.status(404).json({error: `error could not find ${this.wrapper.name()}. ${err}`});
        reject(err);
      });
    });
  }

  public update(req: express.Request, res: express.Response, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      const instance = req.body;
      LOGGER.debug(`update ${this.wrapper.name()}: ${JSON.stringify(instance)}`);
      this.wrapper.update(instance, transaction).then((result) => {
        if (result[0] === 1) {
          res.json(1);
          resolve();
        } else {
          res.status(404).json(
            {error: `error update ${this.wrapper.name()} failed (update count is not 1 (${result[0]})`});
          reject("Update with wrong id elements found.");
        }
      }).catch((err) => {
        res.status(404).json({error: `error update ${this.wrapper.name()} failed. ${err.message}`});
        reject(err);
      });
    });
  }
}
