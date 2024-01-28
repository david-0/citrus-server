import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { ArticleController } from "../controller/ArticleController";

const Router = express.Router();

Router.get(
    "/:id([0-9]+)",
    ArticleController.get
);
Router.get(
    "",
    ArticleController.getAll
);
Router.put(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    ArticleController.update
);
Router.post(
    "",
    authentification,
    authorization(["admin"]),
    ArticleController.save
);
Router.delete(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    ArticleController.delete
);
Router.get(
    "inSale",
    ArticleController.getAllInSale
);
Router.get(
    "/withStock/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    ArticleController.getWithAll
);
Router.get(
    "/withStock",
    authentification,
    authorization(["admin"]),
    ArticleController.getAllWithAll
);
Router.get(
    "/withAll/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    ArticleController.getWithAll
);
Router.get(
    "/withAll",
    authentification,
    authorization(["admin"]),
    ArticleController.getAllWithAll
);
Router.delete(
    "/withAll/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    ArticleController.delete
);
export { Router as articleRouter };