import express = require("express");

export interface IController {
  init(): void;
  add(req: express.Request, res: express.Response): void;
  getAll(req: express.Request, res: express.Response): void;
  get(req: express.Request, res: express.Response): void;
  del(req: express.Request, res: express.Response): void;
  update(req: express.Request, res: express.Response): void;
}
