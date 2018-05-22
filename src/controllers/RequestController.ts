import {IRequest} from "citrus-common";
import * as express from "express";
import {Logger} from "log4js";
import {Model} from "sequelize-typescript";
import {ModelRegistry} from "./ModelRegistry";

const LOGGER: Logger = log4js.getLogger("GenericController");
import log4js = require("log4js");

export class RequestController  {

  private registry = new ModelRegistry();

  constructor() {
  }

  public getRange(req: express.Request, res: express.Response): void {
    const request: IRequest = req.body;
    const model = this.registry.get(request.typeName);
    model.findAndCountAll({
      include: this.getIncludeOptions(request),
      limit: request.limit,
      offset: request.offset,
      order: this.createOrderCondition(request),
      where: this.createFilterCondition(request),
    }).then((result) => {
      res.json(result);
    }).catch((err) => {
      res.status(404).json({error: `error retrieving all ${model.name}s. ${err}`});
    });
  }

  private createFilterCondition(req: IRequest): any {
    /*let filterCondition: any;
    if (req.conditions && req.conditions.length > 0 {
      filterCondition = {};
      req.conditions.forEach((columnName) => {
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
    }*/
    return {};
  }

  private createOrderCondition(req: IRequest): any {
    if (req.order) {
      return req.order;
    }
    return [];
  }

  private getIncludeOptions(req: IRequest): Array<typeof Model> {
    const includes: Array<typeof Model> = new Array<typeof Model>();
    if (req.includedFields) {
      req.includedFields.forEach((i) => includes.push(this.registry.get(i.typeName)));
    }
    return includes;
  }
}
