import * as express from "express";
import {Logger} from "log4js";
import {Model} from "sequelize-typescript";
import {IController} from "./IController";
import {IModelWrapper} from "./IModelWrapper";
import log4js = require("log4js");

let LOGGER: Logger = log4js.getLogger("GenericController");

export class GenericController<T extends Model<T>> implements IController {

  constructor(private wrapper: IModelWrapper<T>) {
    LOGGER = log4js.getLogger(`GenericController-${wrapper.name}`);
  }

  public add(req: express.Request, res: express.Response): void {
    const instance = req.body;
    LOGGER.debug(`create ${this.wrapper.name()}: ${JSON.stringify(instance)}`);
    this.wrapper.create(instance)
      .then((created: T) => {
        LOGGER.debug(`created ${this.wrapper.name()}. successfully, id: ${created.id}`);
        res.status(201).json(created);
      })
      .catch((err) => {
        res.status(500).json({error: `error creating ${this.wrapper.name()} ${instance.id}. ${err}`});
        LOGGER.error("Unable to connect to the database:", err);
      });
  }

  public getAll(req: express.Request, res: express.Response): void {
    this.wrapper.findAll().then((items) => {
      res.json(items);
    }).catch((err) => {
      res.status(404).json({error: `error retrieving all ${this.wrapper.name()}s. ${err}`});
    });
  }

  public get(req: express.Request, res: express.Response): void {
    this.wrapper.findById(req.params.id)
      .then((item) => {
        res.json(item);
      }).catch((err) => {
      res.status(404).json({error: `error retrieving all ${this.wrapper.name()}s. ${err}`});
    });
  }

  public del(req: express.Request, res: express.Response): void {
    this.wrapper.findById(req.params.id).then((item) => {
      item.destroy().then(() => {
        res.json(true);
      }).catch((err) => {
        res.status(404).json({error: `error could not delete ${this.wrapper.name()}. ${err}`});
      });
    })
      .catch((err) => {
        res.status(404).json({error: `error could not find fruit. ${err}`});
      });
  }

  public update(req: express.Request, res: express.Response): void {
    const instance = req.body;
    LOGGER.debug(`update ${this.wrapper.name()}: ${JSON.stringify(instance)}`);
    this.wrapper.update(instance)
      .then((result) => {
        if (result[0] === 1) {
          res.json(1);
        } else {
          res.status(404).json(
            {error: `error update ${this.wrapper.name()} failed (update count is not 1 (${result[0]})`});
        }
      })
      .catch((err) => {
        res.status(404).json({error: `error update ${this.wrapper.name()} failed. ${err}`});
      });
  }
}
