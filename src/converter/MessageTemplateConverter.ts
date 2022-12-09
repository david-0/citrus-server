import { MessageTemplateDto } from "citrus-common";
import { MessageTemplate } from "../entity/MessageTemplate";

export class MessageTemplateConverter {
    public static toDtos(input: MessageTemplate[]): MessageTemplateDto[] {
        return input.map(a => MessageTemplateConverter.toDto(a));
    }

    public static toEntities(input: MessageTemplateDto[]): MessageTemplate[] {
        return input.map(a => MessageTemplateConverter.toEntity(a));
    }

    public static toDto(input: MessageTemplate): MessageTemplateDto {
        const result = MessageTemplateDto.createEmpty();
        result.id = input.id;
        result.subject = input.subject;
        result.content = input.content;
        return result;
    }

    public static toEntity(input: MessageTemplateDto): MessageTemplate {
        const result = new MessageTemplate();
        result.id = input.id;
        result.subject = input.subject;
        result.content = input.content;
        return result;
    }

    public static createIdObj(id: number) {
        const result = new MessageTemplate();
        result.id = id;
        return result;
    }
}