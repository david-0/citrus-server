import * as express from "express";
import {IFruit} from "../entities/IFruit";
import {Fruit} from "../models/Fruit";
import {getLogger, Logger} from "../utils/logger";
import {IController} from "./IController";

const LOGGER: Logger = getLogger("FruitController");

export class FruitController implements IController {

  public add(req: express.Request, res: express.Response): void {
    const fruitTo: IFruit = req.body;
    LOGGER.debug(`create Fruit: ${JSON.stringify(fruitTo)}`);
    Fruit.create(fruitTo)
      .then((createdFruit) => {
        LOGGER.debug(`created Fruit successfully, id: ${createdFruit.id}`);
        res.status(201).json(createdFruit);
      })
      .catch((err) => {
        res.status(500).json({error: `error creating Fruit ${fruitTo.name}. ${err}`});
        LOGGER.error("Unable to connect to the database:", err);
      });
  }

  public getAll(req: express.Request, res: express.Response): void {
    Fruit.findAll<Fruit>().then((fruits) => {
      res.json(fruits);
    }).catch((err) => {
      res.status(404).json({error: `error retrieving all Fruits. ${err}`});
    });
  }

  public getRange(req: express.Request, res: express.Response): void {
    const queryCond = this.createFilterCondition(req);
    Fruit.findAndCountAll<Fruit>({
      limit: req.params.limit,
      offset: req.params.offset,
      order: this.createOrderCondition(req),
      where: this.createFilterCondition(req),
    }).then((result) => {
      res.json(result);
    }).catch((err) => {
      res.status(404).json({error: `error retrieving all Fruits. ${err}`});
    });
  }

  public get(req: express.Request, res: express.Response): void {
    Fruit.findById(req.params.id)
      .then((fruit) => {
        res.json(fruit);
      }).catch((err) => {
      res.status(404).json({error: `error retrieving all Fruits. ${err}`});
    });
  }

  public del(req: express.Request, res: express.Response): void {
    Fruit.findById(req.params.id).then((fruit) => {
      fruit.destroy().then(() => {
        res.json(true);
      }).catch((err) => {
        res.status(404).json({error: `error could not delete fruit. ${err}`});
      });
    })
      .catch((err) => {
        res.status(404).json({error: `error could not find fruit. ${err}`});
      });
  }

  public update(req: express.Request, res: express.Response): void {
    const fruitTo: Fruit = req.body;
    LOGGER.debug(`update Fruit: ${JSON.stringify(fruitTo)}`);
    Fruit.update<Fruit>(fruitTo, {where: {id: fruitTo.id}})
      .then((result) => {
        if (result[0] === 1) {
          res.json(1);
        } else {
          res.status(404).json({error: `error update fruit failed (update count is not 1 (${result[0]})`});
        }
      })
      .catch((err) => {
        res.status(404).json({error: `error update fruit failed. ${err}`});
      });
  }

  private createFilterCondition(req: express.Request): any {
    if (req.query && req.query.filter) {
      return {
        name: {
          $like: `%${req.query.filter}%`,
        },
      };
    }
    return {};
  }

  private createOrderCondition(req: express.Request): any {
    if (req.query && req.query.columnName) {
      return [[req.query.columnName, req.query.direction]];
    }
    return [];
  }
}
