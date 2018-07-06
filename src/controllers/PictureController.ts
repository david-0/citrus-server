import * as express from "express";
import {Logger} from "log4js";
import {Transaction} from "sequelize";
import {Picture} from "../models/Picture";
import {ITransactionController} from "./ITransactionController";
import log4js = require("log4js");

let LOGGER: Logger = log4js.getLogger("GenericController");

export class PictureController implements ITransactionController {

  constructor() {
    LOGGER = log4js.getLogger(`PictureController`);
  }

  public add(req: express.Request, res: express.Response, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const item = new Picture();
      item.id = req.params.id;
      item.contentType = req.headers["content-type"];
      item.image = req.body;
      LOGGER.debug(`create Image`);
      Picture.create(item, {transaction})
        .then((created: Picture) => {
          LOGGER.debug(`created Picture. successfully, id: ${created.id}`);
          res.status(201).json(created);
          resolve();
        })
        .catch((error) => {
          res.status(500).json({error: `error creating Image. ${error}`});
          LOGGER.error("Unable to connect to the database:", error);
          reject(error);
        });
    });
  }

  public getAll(req: express.Request, res: express.Response, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => reject());
  }

  public get(req: express.Request, res: express.Response, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Picture.findById(req.params.id, {transaction}).then((item) => {
        res.contentType(item.contentType);
        res.status(201).send(item.image);
        resolve();
      }).catch((err) => {
        res.status(404).json({error: `error retrieving Image. ${err}`});
        reject(err);
      });
    });
  }

  public del(req: express.Request, res: express.Response, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Picture.findById(req.params.id, {transaction}).then((item) => {
        item.destroy({transaction}).then(() => {
          res.json(true);
          resolve();
        }).catch((error) => {
          res.status(404).json({error: `error could not delete Pictrue. ${error}`});
          reject(error);
        });
      }).catch((error) => {
        res.status(404).json({error: `error could not find Picture. ${error}`});
        reject(error);
      });
    });
  }

  public update(req: express.Request, res: express.Response, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Picture.findById(req.params.id, {transaction}).then((item) => {
        item.contentType = req.headers["content-type"];
        item.image = req.body;
        item.update({transaction}).then(() => {
          res.json(true);
          resolve();
        }).catch((error) => {
          res.status(404).json({error: `error update Picture: ${error}`});
          reject(error);
        });
      }).catch((error) => {
        res.status(404).json({error: `error could not find Picture. ${error}`});
        reject(error);
      });
    });
  }
}
