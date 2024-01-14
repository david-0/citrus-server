import { OrderDto } from "citrus-common";
import { Order } from "../entity/Order";
import { ConverterUtil } from "./ConverterUtil";
import { LocationConverter } from "./LocationConverter";
import { OpeningHourConverter } from "./OpeningHourConverter";
import { OrderItemConverter } from "./OrderItemConverter";
import { UserConverter } from "./UserConverter";

export class OrderConverter {
    public static toDtos(input: Order[]): OrderDto[] {
        return input.map(a => OrderConverter.toDto(a));
    }

    public static toEntities(input: OrderDto[]): Order[] {
        return input.map(a => OrderConverter.toEntity(a));
    }

    public static toDto(input: Order): OrderDto {
        const result = OrderDto.createEmpty();
        result.id = input.id;
        result.date = input.date;
        result.comment = input.comment;
        if (input.location !== undefined && input.location !== null) {
            result.location = LocationConverter.toDto(input.location);
        }
        if (input.user !== undefined && input.user !== null) {
            result.user = UserConverter.toDto(input.user);
        }
        if (input.orderItems !== undefined && input.orderItems !== null) {
            result.orderItems = OrderItemConverter.toDtos(input.orderItems);
        }
        result.totalPrice = input.totalPrice;
        if (input.plannedCheckout !== undefined && input.plannedCheckout !== null) {
            result.plannedCheckout = OpeningHourConverter.toDto(input.plannedCheckout);
        }
        result.deliveryNoteCreated = input.deliveryNoteCreated;
        return result;
    }

    public static toEntity(input: OrderDto): Order {
        const result = new Order();
        result.id = input.id;
        result.date = input.date;
        result.comment = input.comment;
        ConverterUtil.updateObjRef(input, result, id => LocationConverter.createIdObj(id), a => a.location, v => v.id, (w, u) => w.location = u);
        ConverterUtil.updateObjRef(input, result,id => UserConverter.createIdObj(id), a => a.user, v => v.id, (w, u) => w.user = u);
        result.totalPrice = input.totalPrice;
        ConverterUtil.updateObjRef(input, result,id => OpeningHourConverter.createIdObj(id), a => a.plannedCheckout, v => v.id, (w, u) => w.plannedCheckout = u);
        result.deliveryNoteCreated = input.deliveryNoteCreated;  
        return result;
    }

    public static createIdObj(id: number) {
        const result = new Order();
        result.id = id;
        return result;
    }
}