import {
    IsUUID,
    IsArray,
    ValidateNested,
    ArrayMinSize,
    IsInt,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
    @IsUUID()
    mealId: string;

    @IsInt()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty()
    @IsUUID()
    restaurantId: string;

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}
