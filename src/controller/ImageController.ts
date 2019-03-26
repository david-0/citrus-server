import {Request, Response} from "express";
import {getType} from "mime";
import Mime from "mime/Mime";
import {Form} from "multiparty";
import {Authorized, Body, Delete, Get, JsonController, Param, Post, Put, Req, Res} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Image} from "../entity/Image";

@JsonController("/api/image")
export class ImageController {

  private imageRepo: (manager: EntityManager) => Repository<Image>;

  constructor() {
    this.imageRepo = manager => manager.getRepository(Image);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public get(@TransactionManager() manager: EntityManager,
             @EntityFromParam("id") image: Image,
             @Res() response: Response) {
    response.contentType(image.contentType);
    response.status(200).send(image.image);
  }

  @Transaction()
  @Authorized("admin")
  @Get()
  public getAll(@TransactionManager() manager: EntityManager) {
    return this.imageRepo(manager).find();
  }

  @Transaction()
  @Authorized("admin")
  @Post()
  public async save(@TransactionManager() manager: EntityManager, @Req() request: Request) {
    const form = new Form();
    const image = new Image();
    form.parse(request, (err, fields, files) => {
      image.contentType = getType(files[0].filename);
      image.image = files[0].data;
    });
    return this.imageRepo(manager).save(image);
  }

  @Transaction()
  @Authorized("admin")
  @Put("/:id([0-9]+)")
  public async update(@TransactionManager() manager: EntityManager,
                      @Body() image: Buffer,
                      @Param("id") id: number,
                      @Req() request: Request) {
    const picture = await this.imageRepo(manager).findOne(id);
    picture.contentType = request.headers["content-type"];
    picture.image = image;
    return this.imageRepo(manager).save(picture);
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/:id([0-9]+)")
  public delete(@TransactionManager() manager: EntityManager, @EntityFromParam("id") picture: Image) {
    return this.imageRepo(manager).remove(picture);
  }
}
