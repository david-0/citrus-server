import * as compression from "compression";
import * as express from "express";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import {verify, VerifyErrors} from "jsonwebtoken";
import {configure, getLogger, Logger} from "log4js";
import * as path from "path";
import "reflect-metadata";
import {Action, useExpressServer} from "routing-controllers";
import {Container} from "typedi";
import {createConnection, useContainer} from "typeorm";
import {AddressController} from "./controller/AddressController";
import {ArticleCheckInController} from "./controller/ArticleCheckInController";
import {ArticleCheckOutController} from "./controller/ArticleCheckOutController";
import {ArticleController} from "./controller/ArticleController";
import {ArticleStockController} from "./controller/ArticleStockController";
import {CartController} from "./controller/CartController";
import {ImageController} from "./controller/ImageController";
import {LocationController} from "./controller/LocationController";
import {MessageController} from "./controller/MessageController";
import {OpeningHourController} from "./controller/OpeningHourController";
import {OrderArchiveController} from "./controller/OrderArchiveController";
import {OrderController} from "./controller/OrderController";
import {OrderItemController} from "./controller/OrderItemController";
import {RoleController} from "./controller/RoleController";
import {SecurityController} from "./controller/SecurityController";
import {UnitOfMeasurementController} from "./controller/UnitOfMeasurementController";
import {UserController} from "./controller/UserController";
import {User} from "./entity/User";
import {SocketService} from "./socket/SocketService";

import {JwtConfiguration} from "./utils/JwtConfiguration";
import {ResetTokenEvictor} from "./utils/ResetTokenEvictor";
import {StartupNotifier} from "./utils/StartupNotifier";
import {SuppressNextMiddlewareHandler} from "./utils/SuppressNextMiddlewareHandler";
import {UrlService} from "./utils/UrlService";
import {UserNotConfirmedEvictor} from "./utils/UserNotConfirmedEvictor";
import {CustomErrorHandler} from "./utils/CustomErrorHandler";
import {DeliveryNoteController} from "./controller/DeliveryNoteController";

const LOGGER: Logger = getLogger("Server");

declare var process: any;
declare var dirname: any;

class Server {

  public static bootstrap(): Server {
    return new Server();
  }

  public app: express.Express;
  private server: any;
  private io: SocketIO.Server;
  private root: string;
  private port: number;
  private protocol: string;
  private portHttps: number;
  private portHttp: number;
  private host: string;
  private env: string;
  private socketService: SocketService;
  private jwtConfig: JwtConfiguration;

  private url: string;

  constructor() {

    configure({
      appenders: {out: {type: "stdout"}},
      categories: {default: {appenders: ["out"], level: "info"}},
    });
    LOGGER.info("Node Version: " + process.version);
    LOGGER.info("Node Env: " + JSON.stringify(process.env));
    this.app = express();
    this.app.use(compression());
    this.config();
    this.socketService = new SocketService();

    useContainer(Container);
    createConnection().then(async connection => {
      await connection.runMigrations({transaction: "each"});
      new ResetTokenEvictor().schedule(0);
      new UserNotConfirmedEvictor().schedule(0);
      this.routes();
      this.staticRoutes();
      this.defaultRoute();
      this.createServer();
      this.listen();
      new StartupNotifier().notify("david.leuenberger@gmx.ch", this.env + ":" + this.port);
    }).catch(err => {
      LOGGER.error("Create Connection error: {}", err);
    });
  }

  private createServer() {
    if (this.env === "production" || fs.existsSync("../certificate/ssl/privkey.pem")) {
      this.redirectHttp();
      this.server = this.createHttpsServer();
    } else {
      this.server = this.createHttpServer();
    }
  }

  private createHttpsServer() {
    LOGGER.info("Start HTTPS server");
    this.port = this.portHttps;
    this.protocol = "https";
    return https.createServer({
      ca: fs.readFileSync("../certificate/ssl/chain.pem"),
      cert: fs.readFileSync("../certificate/ssl/cert.pem"),
      key: fs.readFileSync("../certificate/ssl/privkey.pem"),
    }, this.app);
  }

  private createHttpServer() {
    LOGGER.info("Start HTTP server");
    this.port = this.portHttp;
    this.protocol = "http";
    return http.createServer(this.app);
  }

  private redirectHttp() {
    LOGGER.info(`Redirect from ${this.portHttp} to ${this.portHttps}.`);
    // set up plain http server
    const httpApp = express();
    const httpServer = http.createServer(httpApp);
    httpApp.use("*", this.redirectToHttps);
    httpServer.listen(this.portHttp);
  }

  private redirectToHttps(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.redirect("https://shop.el-refugio-denia.com" + req.url);
  }

  private config(): void {
    this.portHttps = process.env.PORT || 3002;
    this.portHttp = process.env.PORT_HTTP || 3001;
    this.root = path.join(__dirname);
    this.host = "localhost";
    this.env = process.env.NODE_ENV || "development";

    this.jwtConfig = new JwtConfiguration(this.env);
    if (this.env === "production") {
      this.jwtConfig.initProd("../certificate/jwt/private-key.pem", "../certificate/jwt/public-key.pem");
      this.portHttps = process.env.PORT || 443;
      this.portHttp = process.env.PORT_HTTP || 80;
      LOGGER.info(`PRODUCTION-MODE, use private/public keys.`);
    } else {
      LOGGER.info(`DEVELOPMENT-MODE, use shared secret.`);
    }
  }

  private async authorizationChecker(action: Action, roles: string[]): Promise<boolean> {
    const authHeaderName = "authorization";
    const header = action.request.headers[authHeaderName];
    if (!header) {
      return false;
    }
    const token = header.substring(7); // remove "Bearer " prefix
    const user: any = await this.verifyToken(token, this.jwtConfig.getVerifySecret());
    return user && (!roles.length || roles.filter(role => user.roles.indexOf(role) !== -1).length > 0);
  }

  private async currentUserChecker(action: Action): Promise<number> {
    const authHeaderName = "authorization";
    const header = action.request.headers[authHeaderName];
    const token = header.substring(7); // remove "Bearer " prefix
    const user = await this.verifyToken(token, this.jwtConfig.getVerifySecret());
    return user.id;
  }

  private staticRoutes(): void {
    const staticRoutePath = __dirname + "/client";
    if (fs.existsSync(staticRoutePath)) {
      LOGGER.info(`Static-Route: serve files from "/client" in "/"`);
      this.app.use(express.static(__dirname + "/client", {redirect: true}));
    }
  }

  private defaultRoute(): void {
    this.app.get("*", (req, res) => {
      res.sendFile(__dirname + "/client/index.html");
    });
  }

  private routes(): void {
    let corsOptions = {};
    if (this.env !== "production") {
      corsOptions = {
        allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        methods: "POST, GET, PATCH, DELETE, PUT",
        origin: "*",
        preflightContinue: false,
      };
    }
    useExpressServer(this.app, {
      authorizationChecker: async (action: Action, roles: string[]) => this.authorizationChecker(action, roles),
      controllers: [
        AddressController,
        ArticleController,
        ArticleCheckInController,
        ArticleCheckOutController,
        ArticleStockController,
        CartController,
        OrderArchiveController,
        OrderController,
        OrderItemController,
        LocationController,
        OpeningHourController,
        ImageController,
        RoleController,
        UnitOfMeasurementController,
        UserController,
        SecurityController,
        MessageController,
        DeliveryNoteController,
      ],
      cors: corsOptions,
      currentUserChecker: async (action: Action) => this.currentUserChecker(action),
      defaultErrorHandler: false,
      middlewares: [
        CustomErrorHandler,
        SuppressNextMiddlewareHandler,
      ],
    });
  }

  private verifyToken(tokenAsString: string, secret: string | Buffer): Promise<User> {
    return new Promise<User>((resolve, reject) => verify(tokenAsString, secret, (err: VerifyErrors, decoded: User) => {
      if (decoded) {
        resolve(decoded);
      } else {
        reject();
      }
    }));
  }

  // Start HTTP server listening
  private listen(): void {
    this.server.listen(this.port);

    const urlService = Container.get(UrlService);
    urlService.setState(this.env, this.protocol, this.host, this.port);

    // add error handler
    this.server.on("error", this.logError);

    // start listening on port
    this.server.on("listening", () => {
      LOGGER.info(`Citrus server running at ${this.protocol}://${this.host}:${this.port}/`);
    });
  }

  private logError(error: Error) {
    LOGGER.error(`ERROR: ${error.stack}`);
  }
}

// Bootstrap the server
export = Server.bootstrap().app;
