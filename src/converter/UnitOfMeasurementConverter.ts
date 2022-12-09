import { UnitOfMeasurementDto } from "citrus-common";
import { UnitOfMeasurement } from "../entity/UnitOfMeasurement";
import { ArticleConverter } from "./ArticleConverter";

export class UnitOfMeasurementConverter {
    public static toDtos(input: UnitOfMeasurement[]): UnitOfMeasurementDto[] {
        return input.map(a => UnitOfMeasurementConverter.toDto(a));
    }

    public static toEntities(input: UnitOfMeasurementDto[]): UnitOfMeasurement[] {
        return input.map(a => UnitOfMeasurementConverter.toEntity(a));
    }

    public static toDto(input: UnitOfMeasurement): UnitOfMeasurementDto {
        const result = UnitOfMeasurementDto.createEmpty();
        result.id = input.id;
        result.shortcut = input.shortcut;
        result.description = input.description;
        if (input.articles !== undefined && input.articles !== null) {
            result.articles = ArticleConverter.toDtos(input.articles);
        }
        return result;
    }

    public static toEntity(input: UnitOfMeasurementDto): UnitOfMeasurement {
        const result = new UnitOfMeasurement();
        result.id = input.id;
        result.shortcut = input.shortcut;
        result.description = input.description;
        return result;
    }

    public static createIdObj(id: number) {
        const result = new UnitOfMeasurement();
        result.id = id;
        return result;
    }
}