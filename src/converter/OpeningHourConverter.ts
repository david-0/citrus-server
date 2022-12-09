import { OpeningHourDto } from "citrus-common";
import { OpeningHour } from "../entity/OpeningHour";
import { ConverterUtil } from "./ConverterUtil";
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
        ConverterUtil.updateObjRef(input, result, id => LocationConverter.createIdObj(id), a => a.location, v => v.id, (w, u) => w.location = u);
        return result;
    }

    public static createIdObj(id: number) {
        const result = new OpeningHour();
        result.id = id;
        return result;
    }
}