import { OrderItemDto } from "citrus-common";
import { OrderItem } from "../entity/OrderItem";
import { ArticleConverter } from "./ArticleConverter";
import { ConverterUtil } from "./ConverterUtil";
import { OrderConverter } from "./OrderConverter";

export class OrderItemConverter {
    public static toDtos(input: OrderItem[]): OrderItemDto[] {
        return input.map(a => OrderItemConverter.toDto(a));
    }

    public static toEntities(input: OrderItemDto[]): OrderItem[] {
        return input.map(a => OrderItemConverter.toEntity(a));
    }

    public static toDto(input: OrderItem): OrderItemDto {
        const result = OrderItemDto.createEmpty();
        result.id = input.id;
        result.copiedPrice = input.copiedPrice;
        result.quantity = input.quantity;
        if (input.article !== undefined && input.article !== null) {
            result.article = ArticleConverter.toDto(input.article);
        }
        if (input.order !== undefined && input.order !== null) {
            result.order = OrderConverter.toDto(input.order);
        }
        return result;
    }

    public static toEntity(input: OrderItemDto): OrderItem {
        const result = new OrderItem();
        result.id = input.id;
        result.copiedPrice = input.copiedPrice;
        result.quantity = input.quantity;
        ConverterUtil.updateObjRef(input, result, id => ArticleConverter.createIdObj(id), a => a.article, v => v.id, (w, u) => w.article = u);
        ConverterUtil.updateObjRef(input, result, id => OrderConverter.createIdObj(id), a => a.order , v => v.id, (w, u) => w.order = u);
        return result;
    }
}