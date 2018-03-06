import * as express from "express";
import {Router} from "express-serve-static-core";
import {Role} from "../models/Role";
import {User} from "../models/User";
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
    router.route("/api/authenticate")
      .post((req, res) => {
        const email: string = req.body.email;
        const password: string = req.body.password;
        User.findOne({where: {and: {email: {$eq: email}}, password: {$eq: password}}})
          .then((user: User) => {
            res.json({token: this.createToken(user)});
          })
          .catch((err) => {
            this.returnTestingAdminUser(res);
//            res.status(500).json({error: `error creating token for user: ${email}. ${err}`});
          });
      })
      .options((req, res) => {
        res.sendStatus(200);
      });
  }

  /**
   * TODO: remove before production
   * @param {e.Response} res
   */
  private returnTestingAdminUser(res: express.Response) {
    const role = new Role();
    role.name = "admin";
    const user = new User();
    user.email = "a@b";
    user.roles = [role];
    res.json({token: this.createToken(user)});
  }

  private createToken(user: User): string {
    return jwt.sign({email: user.email, roles: user.roles},
      this.jwtConfig.getSignSecret(), this.jwtConfig.getSignOptions());
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
