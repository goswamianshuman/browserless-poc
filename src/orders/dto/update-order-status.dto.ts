import { IsEnum } from 'class-validator';
import { OrderStatus } from '../order.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

