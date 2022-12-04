import { ArticleCheckInDto } from "citrus-common";
import { ArticleCheckIn } from "../entity/ArticleCheckIn";
import { ArticleStockConverter } from "./ArticleStockConverter";
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
        if (input.articleStock !== undefined && input.articleStock !== null) {
            result.articleStock = ArticleStockConverter.toEntity(input.articleStock);
        }
        result.quantity = input.quantity;
        result.plannedDate = input.plannedDate;
        result.comment = input.comment;
        result.done = input.done;
        result.doneDate = input.doneDate;
        if (input.doneUser !== undefined && input.doneUser !== null) {
            result.doneUser = UserConverter.toEntity(input.doneUser);
        }
        return result;
    }
}
