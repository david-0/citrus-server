import { ArticleDto } from "citrus-common";
import { Article } from "../entity/Article";
import { ArticleStockConverter } from "./ArticleStockConverter";
import { ConverterUtil } from "./ConverterUtil";
import { UnitOfMeasurementConverter } from "./UnitOfMeasurementConverter";

export class ArticleConverter {

    public static toDtos(input: Article[]): ArticleDto[] {
        return input.map(a => ArticleConverter.toDto(a));
    }

    public static toEntities(input: ArticleDto[]): Article[] {
        return input.map(a => ArticleConverter.toEntity(a));
    }

    public static toDto(input: Article): ArticleDto {
        const result = ArticleDto.createEmpty();
        result.id = input.id;
        result.number = input.number;
        result.description = input.description;
        result.imageId = input.imageId;
        result.price = input.price;
        result.inSale = input.inSale;
        result.saleUnit = input.saleUnit;
        if (input.unitOfMeasurement !== undefined && input.unitOfMeasurement !== null) {
            result.unitOfMeasurement = UnitOfMeasurementConverter.toDto(input.unitOfMeasurement);
        }
        if (input.articleStocks !== undefined && input.articleStocks !== null) {
            result.articleStocks = ArticleStockConverter.toDtos(input.articleStocks);
        }
        return result;
    }

    public static toEntity(input: ArticleDto): Article {
        const result = new Article();
        result.id = input.id;
        result.number = input.number;
        result.description = input.description;
        result.imageId = input.imageId;
        result.price = input.price;
        result.inSale = input.inSale;
        result.saleUnit = input.saleUnit;
        ConverterUtil.updateObjRef(input, result, id => UnitOfMeasurementConverter.createIdObj(id), a => a.unitOfMeasurement, v => v.id, (w, u) => w.unitOfMeasurement = u);
        return result;
    }

    public static createIdObj(id: number) {
        const result = new Article();
        result.id = id;
        return result;
    }
}
