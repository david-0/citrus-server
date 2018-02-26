import * as express from "express";
import {Router} from "express-serve-static-core";
import {JwtConfiguration} from "../utils/JwtConfiguration";
import eJwt = require("express-jwt");
import jwt = require("jsonwebtoken");

export class SecurityRoutes {
  private securityRouter: Router;

  constructor(private jwtConfig: JwtConfiguration) {
    this.securityRouter = express.Router();
    this.addAuthenticateEndpoint(this.securityRouter);
    this.addAuthorizeEndpoint(this.securityRouter);
  }

  public getRouter(): Router {
    return this.securityRouter;
  }

  private addAuthenticateEndpoint(router: Router) {
    router.route( "/api/authenticate")
      .post((req, res) => {
        const email: string = req.body.email;
        const password: string = req.body.password;
        const authToken = jwt.sign({
          email,
        }, this.jwtConfig.getSignSecret(), this.jwtConfig.getSignOptions());
//        LOGGER.info(`user ${user.email} authenticated successfully`);
        res.json({
          token: authToken,
        });
      })
      .options((req, res) => {
        res.sendStatus(200);
      });
  }

  private addAuthorizeEndpoint(router: Router) {
    this.securityRouter.use("/api", eJwt({secret: this.jwtConfig.getVerifySecret()}), (req, res, next) => {
      if (req.user) {
//        LOGGER.debug(`userid: ${req.user.id}, username: ${req.user.email},
// type: ${req.user.type}, req.body.email: ${req.body.email}`);
        next();
      } else {
        res.status(401).json({error: "not yet authenticated"});
      }
    });
  }
}
