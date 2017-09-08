import {isUndefined} from "util";
import {GenericSocket} from "./GenericSocket";

export class SocketService {
  private genericSockets: Map<string, GenericSocket> = new Map<string, GenericSocket>();
  private initialized: boolean = false;
  private io: SocketIO.Server;

  public init(io: SocketIO.Server) {
    this.io = io;
    this.genericSockets.forEach((value: GenericSocket, key: string) => {
      value.init(this.io);
    });
    this.initialized = true;
  }

  public registerSocket(namespace: string): GenericSocket {
    const socket: GenericSocket = new GenericSocket(namespace);
    if (this.initialized) {
      socket.init(this.io);
    }
    this.genericSockets.set(namespace, socket);
    return socket;
  }

  public getSocket(namespace: string): GenericSocket {
    const genericSocket: GenericSocket = this.genericSockets.get(namespace);
    if (isUndefined(genericSocket )) {
      throw new Error(`socket for namespace ${namespace} not defined.`);
    }
    return genericSocket;
  }

  public unregisterSocket(namespace: string) {
    const genericSocket = this.genericSockets.get(namespace);
    if (!isUndefined(genericSocket)) {
      this.genericSockets.get(namespace).close();
      this.genericSockets.delete(namespace);
    }
  }
}
