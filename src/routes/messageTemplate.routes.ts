import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { MessageTemplateController } from "../controller/MessageTemplateController";

const Router = express.Router();

Router.get(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    MessageTemplateController.get
);
Router.get(
    "",
    authentification,
    authorization(["admin"]),
    MessageTemplateController.getAll
);
Router.put(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    MessageTemplateController.update
);
Router.post(
    "",
    authentification,
    authorization(["admin"]),
    MessageTemplateController.save
);
Router.delete(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    MessageTemplateController.delete
);
export { Router as messageTemplateRouter };