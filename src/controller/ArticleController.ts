import { ArticleConverter } from "../converter/ArticleConverter";
import { Article } from "../entity/Article";
import { AppDataSource } from "../utils/app-data-source";
import { Request, Response } from "express";

export class ArticleController {

  private static withAllRelations = [
    "unitOfMeasurement",
    "articleStocks",
    "articleStocks.location",
    "articleStocks.article",
    "articleStocks.article.unitOfMeasurement",
  ];

  static async get(req: Request, res: Response) {

    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const article = await manager.getRepository(Article).findOne({ where: { id: +id } });
      return res.status(200).json(ArticleConverter.toDto(article));
    });
  }

  static async getAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const articles = await manager.getRepository(Article).find({
        relations: ["unitOfMeasurement"],
        order: { id: "ASC" },
      });
      return res.status(200).json(ArticleConverter.toDtos(articles));
    });
  }

  static async update(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const newArticle = ArticleConverter.toEntity(req.body);
      delete newArticle.articleStocks; // do not save stocks
      const articleRepository = manager.getRepository(Article);
      const loadedArticle = await articleRepository.findOne({ where: { id: +id } });
      const mergedArticle = articleRepository.merge(loadedArticle, newArticle);
      const updatedArticle = await articleRepository.save(mergedArticle);
      return res.status(200).json(ArticleConverter.toDto(updatedArticle));
    });
  }

  static async save(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const newArticle = ArticleConverter.toEntity(req.body);
      delete newArticle.articleStocks; // do not save stocks
      const savedArticle = await manager.getRepository(Article).save(newArticle);
      return res.status(200).json(ArticleConverter.toDto(savedArticle));
    });
  }

  static async delete(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const articleToDelete = new Article();
      articleToDelete.id = +id;
      const deletedArticle = await manager.getRepository(Article).remove(articleToDelete);
      return res.status(200).json(ArticleConverter.toDto(deletedArticle));
    });
  }

  static async getAllInSale(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const articles = await manager.getRepository(Article).find({
        where: { inSale: true },
        relations: this.withAllRelations,
        order: { id: "ASC" },
      });
      return res.status(200).json(ArticleConverter.toDtos(articles));
    });
  }

  static async getWithAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const article = await manager.getRepository(Article).findOne({
        where: { id: +id },
        relations: this.withAllRelations,
        order: { id: "ASC" },
      });
      return res.status(200).json(ArticleConverter.toDto(article));
    });
  }

  static async getAllWithAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const articles = await manager.getRepository(Article).find({
        relations: this.withAllRelations,
        order: { id: "ASC" },
      });
      return res.status(200).json(ArticleConverter.toDtos(articles));
    });
  }
}