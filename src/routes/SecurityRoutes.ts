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
    this.addChangePasswordEndpoint(this.securityRouter);
    this.addChangeMyPasswordEndpoint(this.securityRouter);
  }

  public getRouter(): Router {
    return this.securityRouter;
  }

  private addChangePasswordEndpoint(router: Router) {
    router.route("/api/user/:id([0-9]+)/changepassword")
      .post(this.requiresAdmin, (req, res, next) => {
        this.updatePasswordById(+req.params.id, req.body.password, (user) => {
          res.json(1);
        }, (msg) => {
          res.status(404).json(
            {error: `error update User paswword failed`});
        });
      });
  }

  private addChangeMyPasswordEndpoint(router: Router) {
    router.route("/api/user/changemypassword")
      .post((req, res, next) => {
        this.updatePasswordByEmail(req.user.email, req.body.password, (user) => {
          res.status(200);
          res.json({token: this.createToken(user)});
        }, (msg) => {
          res.status(500);
          res.json({error: `error update paswword failed, (${msg})`});
        });
      });
  }

  private updatePasswordByEmail(email: string, password: string,
                                success: (user: User) => void,
                                error: (message: string) => void) {
    this.findUserbyEmail(email, (user) => {
      this.updatePassword(user, password, (user1) => {
        success(user1);
      }, (message) => {
        error(message);
      });
    }, (message) => {
      error(message);
    });
  }

  private updatePasswordById(id: number, password: string,
                             success: (user: User) => void,
                             error: (message: string) => void) {
    this.findUserbyId(id, (user) => {
      this.updatePassword(user, password, (user1) => {
        success(user1);
      }, (message) => {
        error(message);
      });
    }, (message) => {
      error(message);
    });
  }

  private updatePassword(user: User, password: string,
                         success: (user: User) => void,
                         error: (message: string) => void) {
    User.update({password}, {where: {id: user.id}})
      .then((result) => {
        if (result[0] === 1) {
          user.password = password;
          success(user);
        } else {
          error("2");
        }
      })
      .catch((err) => {
        error(err);
      });
  }

  private findUserbyId(id: number,
                       success: (user: User) => void,
                       error: (message: string) => void) {
    User.findOne({where: {id: {$eq: id}}})
      .then((user: User) => {
        success(user);
      })
      .catch((err) => {
        error(err);
      });
  }

  private findUserbyEmail(email: string,
                          success: (user: User) => void,
                          error: (message: string) => void) {
    User.findAll({where: {email: {$eq: email}}})
      .then((users: User[]) => {
        if (users.length !== 1) {
          error("1");
        } else {
          success(users[0]);
        }
      })
      .catch((err) => {
        error(err);
      });
  }

  private requiresAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const valid: boolean = req.user && (req.user.roles.map((r: Role) => r.name)
      .filter((n: string) => n === "admin"));
    if (valid) {
      next();
    } else {
      res.status(403).json({error: `not authorized to use ${req.baseUrl}`});
    }
  }

  private addAuthenticateEndpoint(router: Router) {
    router.route("/api/authenticate")
      .post((req, res) => {
        const email: string = req.body.email;
        const password: string = req.body.password;
        User.findOne({where: {$and: {email: {$eq: email}}, password: {$eq: password}}})
          .then((user: User) => {
            console.info(`login successfull, password correct ${JSON.stringify(user)}`)
            res.json({token: this.createToken(user)});
          })
          .catch((err) => {
            console.info("login NOT successfull --> fake admin user")
            res.json({token: this.createToken(this.createTestingAdminUser())});
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
  private createTestingAdminUser(): User {
    const role = new Role();
    role.name = "admin";
    const user = new User();
    user.email = "a@b";
    user.roles = [role];
    return user;
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
