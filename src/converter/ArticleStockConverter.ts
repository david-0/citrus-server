import { ArticleStockDto } from "citrus-common";
import { ArticleStock } from "../entity/ArticleStock";
import { ArticleCheckInConverter } from "./ArticleCheckInConverter";
import { ArticleCheckOutConverter } from "./ArticleCheckOutConverter";
import { ArticleConverter } from "./ArticleConverter";
import { LocationConverter } from "./LocationConverter";
import { OrderItemConverter } from "./OrderItemConverter";

export class ArticleStockConverter {

    public static toDtos(input: ArticleStock[]): ArticleStockDto[] {
        return input.map(a => ArticleStockConverter.toDto(a));
    }

    public static toEntities(input: ArticleStockDto[]): ArticleStock[] {
        return input.map(a => ArticleStockConverter.toEntity(a));
    }

    public static toDto(input: ArticleStock): ArticleStockDto {
        const result = ArticleStockDto.createEmpty();
        result.id = input.id;
        if (input.article !== undefined && input.article !== null) {
            result.article = ArticleConverter.toDto(input.article);
        } else {
            delete input.article;
        }
        result.quantity = input.quantity;
        result.reservedQuantity = input.reservedQuantity;
        result.soldOut = input.soldOut;
        result.visible = input.visible;

        if (input.checkIns !== undefined && input.checkIns !== null) {
            result.checkIns = ArticleCheckInConverter.toDtos(input.checkIns);
        }
        if (input.checkOuts !== undefined && input.checkOuts !== null) {
            result.checkOuts = ArticleCheckOutConverter.toDtos(input.checkOuts);
        }    
        if (input.location !== undefined && input.location !== null) {
            result.location = LocationConverter.toDto(input.location);
        }
        return result;
    }

    public static toEntity(input: ArticleStockDto): ArticleStock {
        const result = new ArticleStock();
        result.id = input.id;
        if (input.article !== undefined && input.article !== null) {
            result.article = ArticleConverter.toEntity(input.article);
        } else {
            delete input.article;
        }
        result.quantity = input.quantity;
        result.reservedQuantity = input.reservedQuantity;
        result.soldOut = input.soldOut;
        result.visible = input.visible;

        if (input.checkIns !== undefined && input.checkIns !== null) {
            result.checkIns = ArticleCheckInConverter.toEntities(input.checkIns);
        }
        if (input.checkOuts !== undefined && input.checkOuts !== null) {
            result.checkOuts = ArticleCheckOutConverter.toEntities(input.checkOuts);
        }
        if (input.location !== undefined && input.location !== null) {
            result.location = LocationConverter.toEntity(input.location);
        }
        return result;
    }
}