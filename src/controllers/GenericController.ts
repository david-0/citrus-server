import * as express from "express";
import {Logger} from "log4js";
import {Model} from "sequelize-typescript";
import {IBeforeUpdate} from "./IBeforeInterface";
import {IController} from "./IController";
import {ModelRegistry} from "./ModelRegistry";
import log4js = require("log4js");

let LOGGER: Logger = log4js.getLogger("GenericController");

export class GenericController<T extends Model<T>> implements IController {

  private registry = new ModelRegistry();

  constructor(private model: typeof Model, private beforeUpdate: IBeforeUpdate<T> = null) {
    LOGGER = log4js.getLogger(`GenericController-${model.name}`);
  }

  public add(req: express.Request, res: express.Response): void {
    const instance: T = req.body;
    LOGGER.debug(`create ${this.model.name}: ${JSON.stringify(instance)}`);
    this.model.create(instance)
      .then((created: T) => {
        LOGGER.debug(`created ${this.model.name}. successfully, id: ${created.id}`);
        res.status(201).json(created);
      })
      .catch((err) => {
        res.status(500).json({error: `error creating ${this.model.name} ${instance.id}. ${err}`});
        LOGGER.error("Unable to connect to the database:", err);
      });
  }

  public getAll(req: express.Request, res: express.Response): void {
    this.model.findAll().then((items) => {
      res.json(items);
    }).catch((err) => {
      res.status(404).json({error: `error retrieving all ${this.model.name}s. ${err}`});
    });
  }

  public getRange(req: express.Request, res: express.Response): void {
    this.model.findAndCountAll({
      include: this.getIncludeOptions(req),
      limit: req.params.limit,
      offset: req.params.offset,
      order: this.createOrderCondition(req),
      where: this.createFilterCondition(req),
    }).then((result) => {
      res.json(result);
    }).catch((err) => {
      res.status(404).json({error: `error retrieving all ${this.model.name}s. ${err}`});
    });
  }

  public get(req: express.Request, res: express.Response): void {
    this.model.findById(req.params.id, {include: this.getIncludeOptions(req)})
      .then((item) => {
        res.json(item);
      }).catch((err) => {
      res.status(404).json({error: `error retrieving all ${this.model.name}s. ${err}`});
    });
  }

  public del(req: express.Request, res: express.Response): void {
    this.model.findById(req.params.id).then((item) => {
      item.destroy().then(() => {
        res.json(true);
      }).catch((err) => {
        res.status(404).json({error: `error could not delete ${this.model.name}. ${err}`});
      });
    })
      .catch((err) => {
        res.status(404).json({error: `error could not find fruit. ${err}`});
      });
  }

  public update(req: express.Request, res: express.Response): void {
    const inputItem: T = req.body;
    LOGGER.debug(`update ${this.model.name}: ${JSON.stringify(inputItem)}`);
    if (this.beforeUpdate) {
      this.beforeUpdate.beforeUpdate(inputItem);
    }
    this.model.update(inputItem, {where: {id: inputItem.id}})
      .then((result) => {
        if (result[0] === 1) {
          res.json(1);
        } else {
          res.status(404).json(
            {error: `error update ${this.model.name} failed (update count is not 1 (${result[0]})`});
        }
      })
      .catch((err) => {
        res.status(404).json({error: `error update ${this.model.name} failed. ${err}`});
      });
  }

  private createFilterCondition(req: express.Request): any {
    let filterCondition: any;
    if (req.query && req.query.filter && req.query.filterColumns && req.query.filterColumns.length > 0) {
      filterCondition = {};
      this.getStringArray(req.query.filterColumns).forEach((columnName) => {
        filterCondition[columnName] = {$like: `%${req.query.filter}%`};
      });
    }
    let whereCondition: any;
    if (req.query && req.query.whereColumn && req.query.whereId) {
      whereCondition = {};
      whereCondition[req.query.whereColumn] = {$eq: `${req.query.whereId}`};
    }
    if (!!filterCondition && !!whereCondition) {
      return {$and: [whereCondition, filterCondition]};
    } else if (!!filterCondition) {
      return {$or: filterCondition};
    } else if (!!whereCondition) {
      return whereCondition;
    }
    return {};
  }

  private createOrderCondition(req: express.Request): any {
    if (req.query && req.query.columnName) {
      return [[req.query.columnName, req.query.direction]];
    }
    return [];
  }

  private getIncludeOptions(req: express.Request): Array<typeof Model> {
    const includes: Array<typeof Model> = new Array<typeof Model>();
    if (req.query && req.query.includes) {
      this.getStringArray(req.query.includes).forEach((i) => includes.push(this.registry.get(i)));
    }
    return includes;
  }

  private getStringArray(param: any): string[] {
    if (typeof param === "string") {
      return [param];
    }
    return param;
  }
}
