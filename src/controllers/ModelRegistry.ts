import {Model} from "sequelize-typescript";
import {Address} from "../models/Address";
import {User} from "../models/User";

export class ModelRegistry {
  private registry = new Map<string, typeof Model>();

  constructor() {
    this.add(Address);
    this.add(User);
  }

  public get(key: string): typeof Model {
    return this.registry.get(key);
  }

  private add(model: typeof Model) {
    this.registry.set(model.name, model);
  }
}
