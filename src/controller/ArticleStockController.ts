import { ArticleStockConverter } from "../converter/ArticleStockConverter";
import { ArticleStock } from "../entity/ArticleStock";
import { Request, Response } from "express";
import { AppDataSource } from "../utils/app-data-source";

export class ArticleStockController {

  private static withAllRelations = [
    "article",
    "article.unitOfMeasurement",
    "location"];

  private static withArticleRelation = [
    "article"];

  static async get(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const articleStock = await manager.getRepository(ArticleStock).findOne({ where: { id: +id } });
      return res.status(200).json(ArticleStockConverter.toDto(articleStock));
    });
  }

  static async getAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const articleStocks = await manager.getRepository(ArticleStock).find({
        order: { id: "ASC" },
      });
      return res.status(200).json(ArticleStockConverter.toDtos(articleStocks));
    });
  }

  static async getWithArticle(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const articleStock = await manager.getRepository(ArticleStock).findOne({
        where: { id: +id },
        relations: ArticleStockController.withArticleRelation,
      });
      return res.status(200).json(ArticleStockConverter.toDto(articleStock));
    });
  }

  static async getAllWithArticle(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const articleStocks = await manager.getRepository(ArticleStock).find({
        relations: ArticleStockController.withArticleRelation,
        order: { id: "ASC" },
      });
      return res.status(200).json(ArticleStockConverter.toDtos(articleStocks));
    });
  }

  static async getWithAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const articleStock = await manager.getRepository(ArticleStock).findOne({
        where: { id: +id },
        relations: ArticleStockController.withAllRelations,
      });
      return res.status(200).json(ArticleStockConverter.toDto(articleStock));
    });
  }

  static async getAllWithAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const articleStocks = await manager.getRepository(ArticleStock).find({
        relations: ArticleStockController.withAllRelations,
        order: { id: "ASC" },
      });
      return res.status(200).json(ArticleStockConverter.toDtos(articleStocks));
    });
  }

  static async save(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const newArticleStock = ArticleStockConverter.toEntity(req.body);
      const savedArticleStock = await manager.getRepository(ArticleStock).save(newArticleStock);
      return res.status(200).json(ArticleStockConverter.toDto(savedArticleStock));
    });
  }

  static async update(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const newArticleStock = ArticleStockConverter.toEntity(req.body);
      const articleStockRepository = manager.getRepository(ArticleStock);
      const loadedArticleStock = await articleStockRepository.findOne({ where: { id: +id } });
      const mergedArticleStock = articleStockRepository.merge(loadedArticleStock, newArticleStock);
      const updatedArticleStock = await articleStockRepository.save(mergedArticleStock);
      return res.status(200).json(ArticleStockConverter.toDto(updatedArticleStock));
    });
  }

  static async delete(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const articleStockToDelete = new ArticleStock();
      articleStockToDelete.id = +id;
      const deletedArticleStock = await manager.getRepository(ArticleStock).remove(articleStockToDelete);
      return res.status(200).json(ArticleStockConverter.toDto(deletedArticleStock));
    });
  }
}
