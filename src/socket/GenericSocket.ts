import {getLogger, Logger} from "../utils/logger";
import Namespace = SocketIO.Namespace;
import Socket = SocketIO.Socket;

const LOGGER: Logger = getLogger("GenericSocket");

/**
 * The GenericSocket sends values to all registered clients.
 */
export class GenericSocket {
  private namespace: Namespace;
  private io: SocketIO.Server;
  private initialized: boolean = false;

  constructor(private namespaceName: string) {
  }

  public init(io: SocketIO.Server): GenericSocket {
    if (this.initialized) {
      return this;
    }
    this.io = io;
    this.namespace = this.io.of(`${this.namespaceName}`);
    this.namespace.on("connection", (socket: Socket) => {
      LOGGER.info(`Socket.IO: Client ${socket.client.id} on ${this.namespaceName} connected`);
      this.listen(socket);
    });
    LOGGER.info(`Socket.IO: namespace ${this.namespaceName} initialized`);
    this.initialized = true;
    return this;
  }

  public del(value: any) {
    LOGGER.debug(`websocket.delete namespace: ${this.namespace.name} ${JSON.stringify(value)}`);
    this.namespace.emit("delete", value);
  }

  public update(value: any) {
    LOGGER.debug(`websocket.update namespace: ${this.namespace.name} ${JSON.stringify(value)}`);
    this.namespace.emit("update", value);
  }

  public create(value: any) {
    LOGGER.debug(`websocket.create namespace: ${this.namespace.name} ${JSON.stringify(value)}`);
    this.namespace.emit("create", value);
  }

  public close() {
    // Get Object with Connected SocketIds as properties
    const connectedNameSpaceSockets = Object.keys(this.namespace.connected);
    connectedNameSpaceSockets.forEach((socketId) => {
      const currentSocket: Socket = this.namespace.connected[socketId];
      currentSocket.disconnect(); // Disconnect Each socket
      LOGGER.info(`Socket.IO: namespace ${this.namespaceName} client ${currentSocket.id} disconnected`);
    });
    this.namespace.removeAllListeners(); // Remove all Listeners for the event emitter
    delete this.io.nsps[this.namespaceName]; // Remove from the server namespaces
    LOGGER.info(`Socket.IO: namespace ${this.namespaceName} closed`);
  }

  private listen(socket: any): void {
    socket.on("disconnect", () => this.disconnect());
  }

  private disconnect(): void {
    LOGGER.info(`Client disconnected ${this.namespace.name}`);
  }
}
