import { ArticleCheckInDto } from "citrus-common";
import { ArticleCheckIn } from "../entity/ArticleCheckIn";
import { ArticleStockConverter } from "./ArticleStockConverter";
import { ConverterUtil } from "./ConverterUtil";
import { UserConverter } from "./UserConverter";

export class ArticleCheckInConverter {

    public static toDtos(input: ArticleCheckIn[]): ArticleCheckInDto[] {
        return input.map(a => ArticleCheckInConverter.toDto(a));
    }

    public static toEntities(input: ArticleCheckInDto[]): ArticleCheckIn[] {
        return input.map(a => ArticleCheckInConverter.toEntity(a));
    }

    public static toDto(input: ArticleCheckIn): ArticleCheckInDto {
        const result = ArticleCheckInDto.createEmpty();
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

    public static toEntity(input: ArticleCheckInDto): ArticleCheckIn {
        const result = new ArticleCheckIn();
        result.id = input.id;
        ConverterUtil.updateObjRef(input, result, id => ArticleStockConverter.createIdObj(id), a => a.articleStock, v => v.id, (w, u) => w.articleStock = u);
        result.quantity = input.quantity;
        result.plannedDate = input.plannedDate;
        result.comment = input.comment;
        result.done = input.done;
        result.doneDate = input.doneDate;
        ConverterUtil.updateObjRef(input, result, id => UserConverter.createIdObj(id), a => a.doneUser, v => v.id, (w, u) => w.doneUser = u);
        return result;
    }
}
