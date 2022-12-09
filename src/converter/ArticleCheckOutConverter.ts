import { ArticleCheckOutDto } from "citrus-common";
import { ArticleCheckOut } from "../entity/ArticleCheckOut";
import { ArticleStockConverter } from "./ArticleStockConverter";
import { ConverterUtil } from "./ConverterUtil";
import { UserConverter } from "./UserConverter";

export class ArticleCheckOutConverter {

    public static toDtos(input: ArticleCheckOut[]): ArticleCheckOutDto[] {
        return input.map(a => ArticleCheckOutConverter.toDto(a));
    }

    public static toEntities(input: ArticleCheckOutDto[]): ArticleCheckOut[] {
        return input.map(a => ArticleCheckOutConverter.toEntity(a));
    }

    public static toDto(input: ArticleCheckOut): ArticleCheckOutDto {
        const result = ArticleCheckOutDto.createEmpty();
        result.id = input.id;
        if (input.articleStock !== undefined && input.articleStock !== null) {
            result.articleStock = ArticleStockConverter.toDto(input.articleStock);
        }
        result.quantity = input.quantity;
        result.plannedDate = input.plannedDate;
        result.comment = input.comment;
        result.done = input.done;
        result.doneDate = input.doneDate;
        if (input.doneUser !== undefined && input.doneUser !== null) {
            result.doneUser = UserConverter.toDto(input.doneUser);
        }
        return result;
    }

    public static toEntity(input: ArticleCheckOutDto): ArticleCheckOut {
        const result = new ArticleCheckOut();
        result.id = input.id;
        ConverterUtil.updateObjRef(input,result, id => ArticleStockConverter.createIdObj(id), a => a.articleStock, v => v.id, (w, u) => w.articleStock = u);
        result.quantity = input.quantity;
        result.plannedDate = input.plannedDate;
        result.comment = input.comment;
        result.done = input.done;
        result.doneDate = input.doneDate;
        ConverterUtil.updateObjRef(input, result, id => UserConverter.createIdObj(id), a => a.doneUser, v => v.id, (w, u) => w.doneUser = u);
        return result;
    }
}
