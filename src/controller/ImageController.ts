import { Request, Response } from "express";
import * as fs from "fs";
import * as mime from 'mime';
import { Form } from "multiparty";
import { Image } from "../entity/Image";
import { AppDataSource } from "../utils/app-data-source";

export class ImageController {

  static async get(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const image = await manager.getRepository(Image).findOne({
        where: { id: +id },
        order: { id: "ASC" },
      });
      res.contentType(image.contentType);
      return res.status(200).send(image.image);
    });
  }

  static async save(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const form = new Form();
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (files.fileKey) {
            image.contentType = mime.getType(files.fileKey[0].originalFilename);
            image.image = fs.readFileSync(files.fileKey[0].path);
          }
          resolve();
        });
      });
      if (image.image) {
        const savedImage = await manager.getRepository(Image).save(image);
        return savedImage.id;
      }
      return null;
    });
  }
}
