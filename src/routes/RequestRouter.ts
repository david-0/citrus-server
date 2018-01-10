import express = require("express");
import {IController} from "../controllers/IController";
import {RequestController} from "../controllers/RequestController";

export class RequestRouter {
  public static all(controller: RequestController) {
    const router = express.Router();
    router.route("/")
      .post((req, res) => controller.getRange(req, res))
    return router;
  }
}
