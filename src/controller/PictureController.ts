import {Request, Response} from "express";
import {Authorized, Body, Delete, Get, JsonController, Param, Post, Put, Req, Res} from "routing-controllers";
import {getConnectionManager, Repository} from "typeorm";
import {EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Picture} from "../entity/Picture";

@JsonController("/api/picture")
export class PictureController {

  private pictureRepository: Repository<Picture>;

  constructor() {
    this.pictureRepository = getConnectionManager().get().getRepository(Picture);
  }

  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") picture: Picture, @Res() response: Response) {
    response.contentType(picture.contentType);
    response.status(200).send(picture.image);
  }

  @Authorized("admin")
  @Get()
  public getAll() {
    return this.pictureRepository.find();
  }

  @Authorized("admin")
  @Post()
  public async save(@Body() image: Buffer,@Req() request: Request) {
    const picture = new Picture();
    picture.contentType = request.headers["content-type"];
    picture.image = image;
    return this.pictureRepository.save(picture);
  }

  @Authorized("admin")
  @Put("/:id([0-9]+)")
  public async update(@Body() image: Buffer, @Param("id") id: number, @Req() request: Request) {
    const picture = await this.pictureRepository.findOne(id);
    picture.contentType = request.headers["content-type"];
    picture.image = image;
    return this.pictureRepository.save(picture);
  }

  @Authorized("admin")
  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") picture: Picture) {
    return this.pictureRepository.remove(picture);
  }
}
