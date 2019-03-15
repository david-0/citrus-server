import {Request, Response} from "express";
import {Authorized, Body, Delete, Get, JsonController, Param, Post, Put, Req, Res} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Picture} from "../entity/Picture";

@JsonController("/api/picture")
export class PictureController {

  private pictureRepo: (manager: EntityManager) => Repository<Picture>;

  constructor() {
    this.pictureRepo = manager => manager.getRepository(Picture);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public get(@TransactionManager() manager: EntityManager,
             @EntityFromParam("id") picture: Picture,
             @Res() response: Response) {
    response.contentType(picture.contentType);
    response.status(200).send(picture.image);
  }

  @Transaction()
  @Authorized("admin")
  @Get()
  public getAll(@TransactionManager() manager: EntityManager) {
    return this.pictureRepo(manager).find();
  }

  @Transaction()
  @Authorized("admin")
  @Post()
  public async save(@TransactionManager() manager: EntityManager, @Body() image: Buffer, @Req() request: Request) {
    const picture = new Picture();
    picture.contentType = request.headers["content-type"];
    picture.image = image;
    return this.pictureRepo(manager).save(picture);
  }

  @Transaction()
  @Authorized("admin")
  @Put("/:id([0-9]+)")
  public async update(@TransactionManager() manager: EntityManager,
                      @Body() image: Buffer,
                      @Param("id") id: number,
                      @Req() request: Request) {
    const picture = await this.pictureRepo(manager).findOne(id);
    picture.contentType = request.headers["content-type"];
    picture.image = image;
    return this.pictureRepo(manager).save(picture);
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/:id([0-9]+)")
  public delete(@TransactionManager() manager: EntityManager, @EntityFromParam("id") picture: Picture) {
    return this.pictureRepo(manager).remove(picture);
  }
}
