import {DtoId} from "citrus-common/lib/dto/dto-id";

export interface IProjector<DTO extends DtoId, T> {
  project(dto: DTO): Promise<T>;
//  unproject(t: T): Promise<DTO>;
}
