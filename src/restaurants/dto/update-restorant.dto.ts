import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpdateRestaurantDto {
  @ApiProperty()
  @IsString()
  @MaxLength(150)
  name?: string;
 
  @ApiProperty()
  @IsString()
  description?: string;
}
