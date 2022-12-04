import { OpeningHourDto } from "citrus-common";
import { OpeningHour } from "../entity/OpeningHour";
import { LocationConverter } from "./LocationConverter";
import { OrderConverter } from "./OrderConverter";

export class OpeningHourConverter {
    public static toDtos(input: OpeningHour[]): OpeningHourDto[] {
        return input.map(a => OpeningHourConverter.toDto(a));
    }

    public static toEntities(input: OpeningHourDto[]): OpeningHour[] {
        return input.map(a => OpeningHourConverter.toEntity(a));
    }

    public static toDto(input: OpeningHour): OpeningHourDto {
        const result = OpeningHourDto.createEmpty();
        result.id = input.id;
        result.fromDate = input.fromDate;
        result.toDate = input.toDate;
        if (input.location !== undefined && input.location !== null) {
            result.location = LocationConverter.toDto(input.location);
        }

        return result;
    }

    public static toEntity(input: OpeningHourDto): OpeningHour {
        const result = new OpeningHour();
        result.id = input.id;
        result.fromDate = input.fromDate;
        result.toDate = input.toDate;
        if (input.location !== undefined && input.location !== null) {
            result.location = LocationConverter.toEntity(input.location);
        }
        return result;
    }
}