import { OrderArchiveDto } from "citrus-common";
import { OrderArchive } from "../entity/OrderArchive";

export class OrderArchiveConverter {
    public static toDtos(input: OrderArchive[]): OrderArchiveDto[] {
        return input.map(a => OrderArchiveConverter.toDto(a));
    }

    public static toDto(orderArchive: OrderArchive): OrderArchiveDto {
        const order = JSON.parse(orderArchive.order);
        order.date = new Date(order.date);
        if (order.plannedCheckout)
        return new OrderArchiveDto(orderArchive.id, orderArchive.archiveDate,
            JSON.parse(orderArchive.archiveUser), order);
    }
}