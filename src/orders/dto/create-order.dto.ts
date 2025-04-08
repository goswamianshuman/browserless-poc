import {
    IsUUID,
    IsArray,
    ValidateNested,
    ArrayMinSize,
    IsInt,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
    @IsUUID()
    mealId: string;

    @IsInt()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @IsUUID()
    restaurantId: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}
