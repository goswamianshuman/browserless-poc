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
    @ApiProperty({ example: '8c9c1b20-1a0e-4e60-88ff-1e80f98cbb84' })
    @IsUUID()
    mealId: string;
  
    @ApiProperty({ example: 2, minimum: 1 })
    @IsInt()
    @Min(1)
    quantity: number;
  }
  
  export class CreateOrderDto {
    @ApiProperty({
      example: '6576823d-fb94-44f6-ac37-9b9d0c3a7bb4',
      description: 'Restaurant ID where order is placed',
    })
    @IsUUID()
    restaurantId: string;
  
    @ApiProperty({
      description: 'Array of meals to order with quantity',
      type: [OrderItemDto],
    })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
  }
  