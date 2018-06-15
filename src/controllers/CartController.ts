import * as express from "express";
import {Logger} from "log4js";
import {IController} from "./IController";
import log4js = require("log4js");

let LOGGER: Logger = log4js.getLogger("CartController");

export class CartController implements IController {

  public add(req: express.Request, res: express.Response): void {
    const cartDto = req.body;
    cartDto.id = 1;
    LOGGER.debug(JSON.stringify(cartDto));
    res.json(cartDto);
  }

  public getAll(req: express.Request, res: express.Response): void {
  }

  public get(req: express.Request, res: express.Response): void {
  }

  public del(req: express.Request, res: express.Response): void {
  }

  public update(req: express.Request, res: express.Response): void {
  }
}
