import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as express from "express";
import * as fs from "fs";
import * as http from "http";
import * as createError from "http-errors";
import * as https from "https";
import * as log4js from "log4js";
import * as path from "path";
import * as socketIo from "socket.io";
import {DBService} from "./services/DBService";
import {SocketService} from "./socket/SocketService";
import {getLogger, Logger} from "./utils/logger";

import {JwtConfiguration} from "./utils/JwtConfiguration";
import {FruitController} from "./controllers/FruitController";
import {GenericRouter} from "./routes/GenericRouter";

const LOGGER: Logger = getLogger("Server");

declare var process: any;
declare var dirname: any;

class Server {

  // Bootstrap the application.
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

  constructor() {
    // Create expressjs application
    this.app = express();
    this.app.use(compression());

    // Configure application
    this.config();

    // create ClientSocketService
    this.socketService = new SocketService();

    // Create database connections
    this.databases();

    // Setup routes
    this.routes();

    // Create server
    this.createServer();

    // Handle websockets
    this.sockets();

    // Start listening
    this.listen();
  }

  private createServer() {
    if (this.env === "production" || fs.existsSync("../../certificate/privkey.pem")) {
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
      ca: fs.readFileSync("../../certificate/chain.pem"),
      cert: fs.readFileSync("../../certificate/cert.pem"),
      key: fs.readFileSync("../../certificate/privkey.pem"),
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
    res.redirect("https://pfila2017-mutig-vorwaerts.ch" + req.url);
  }

  private config(): void {
    this.portHttps = process.env.PORT || 3002;
    this.portHttp = process.env.PORT_HTTP || 3001;
    this.root = path.join(__dirname);
    this.host = "localhost";
    this.env = process.env.NODE_ENV || "development";

    this.jwtConfig = new JwtConfiguration(this.env);
    if (this.env === "production") {
      this.jwtConfig.initProd("../../ha-key", "../../ha-key.pub");
      this.portHttps = process.env.PORT || 443;
      this.portHttp = process.env.PORT_HTTP || 80;
      LOGGER.info(`PRODUCTION-MODE, use private/public keys.`);
    } else {
      LOGGER.info(`DEVELOPMENT-MODE, use shared secret.`);
    }
  }

  private routes(): void {
    this.app.use(log4js.connectLogger(LOGGER, {
      format: "express --> :method :url :status :req[Accept] :res[Content-Type]",
      level: "trace",
    }));
    this.app.use(express.static(__dirname + "/public"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(this.inputLogger);

    this.app.use("/", this.appendHeaders);

//    this.app.use(getAuthenticationRoute(this.jwtConfig));
    const fruitController = new FruitController();
    this.app.use("/api/fruit", GenericRouter.getOne(fruitController));
    this.app.use("/api/fruit", GenericRouter.post(fruitController));
    this.app.use("/api/fruit", GenericRouter.put(fruitController));
//    this.app.use("/api/fruit", GenericRouter.getAll(fruitController));
    this.app.use("/api/fruit", GenericRouter.getRange(fruitController));
    this.app.use("/api/fruit", GenericRouter.del(fruitController));

    this.app.use("/api", this.createError);

    this.app.use(this.sendFile);

    this.app.use(this.outputLogger);
    this.app.use(this.errorHandler);
  }

  private appendHeaders(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, PUT");
    next();
  }

  private createError(req: express.Request, res: express.Response, next: express.NextFunction) {
    next(createError(404, `No route found for ${req.method} ${req.url}`));
  }

  private sendFile(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.sendFile(__dirname + "/public/index.html");
  }

  // Configure databases
  private databases(): void {
    DBService.init();
  }

  // Configure sockets
  private sockets(): void {
    // Get socket.io handle
    /*    this.io = socketIo(this.server);
        this.io.use(socketioJwt.authorize({
          handshake: true,
          secret: this.jwtConfig.getVerifySecret(),
        }));

        this.socketService.init(this.io);*/
  }

  // Start HTTP server listening
  private listen(): void {
    this.server.listen(this.port);

    // add error handler
    this.server.on("error", this.loggError);

    // start listening on port
    this.server.on("listening", () => {
      LOGGER.info(`Citrus server running at ${this.protocol}://${this.host}:${this.port}/`);
    });
  }

  private loggError(error: Error) {
    LOGGER.error(`ERROR: ${error.stack}`);
  }

  private errorHandler(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    LOGGER.error(`ErrorHandler: ${err.stack}`);
    res.status(500).send(err.message);
  }

  private inputLogger(req: express.Request, res: express.Response, next: express.NextFunction) {
    LOGGER.debug(`Request: ${req.method} ${req.url}`);
    next();
  }

  private outputLogger(req: express.Request, res: express.Response, next: express.NextFunction) {
    LOGGER.debug(`Response with status code: ${res.statusCode}`);
    next();
  }
}

// Bootstrap the server
export = Server.bootstrap().app;