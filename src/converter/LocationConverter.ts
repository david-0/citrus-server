import { LocationDto } from "citrus-common";
import { Location } from "../entity/Location";
import { ArticleStockConverter } from "./ArticleStockConverter";
import { OpeningHourConverter } from "./OpeningHourConverter";
import { OrderConverter } from "./OrderConverter";

export class LocationConverter {
    public static toDtos(input: Location[]): LocationDto[] {
        return input.map(a => LocationConverter.toDto(a));
    }

    public static toEntities(input: LocationDto[]): Location[] {
        return input.map(a => LocationConverter.toEntity(a));
    }

    public static toDto(input: Location): LocationDto {
        const result = LocationDto.createEmpty();
        result.id = input.id;
        result.comment = input.comment;
        result.street = input.street;
        result.number = input.number;
        result.addition = input.addition;
        result.zipcode = input.zipcode;
        result.city = input.city;
        result.description = input.description;
        if (input.articleStocks !== undefined && input.articleStocks !== null) {
            result.articleStocks = ArticleStockConverter.toDtos(input.articleStocks);
        }
        if (input.openingHours !== undefined && input.openingHours !== null) {
            result.openingHours = OpeningHourConverter.toDtos(input.openingHours);
        }
        return result;
    }

    public static toEntity(input: LocationDto): Location {
        const result = new Location();
        result.id = input.id;
        result.comment = input.comment;
        result.street = input.street;
        result.number = input.number;
        result.addition = input.addition;
        result.zipcode = input.zipcode;
        result.city = input.city;
        result.description = input.description;
        if (input.articleStocks !== undefined && input.articleStocks !== null) {
            result.articleStocks = ArticleStockConverter.toEntities(input.articleStocks);
        }
        if (input.openingHours !== undefined && input.openingHours !== null) {
            result.openingHours = OpeningHourConverter.toEntities(input.openingHours);
        }
        return result;
    }
}