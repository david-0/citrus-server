import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { SecurityController } from "../controller/SecurityController";

const Router = express.Router();

Router.post(
    "",
    SecurityController.authenticateEndpoint
);
export { Router as securityRouter };