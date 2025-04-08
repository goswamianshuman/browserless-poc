import { IsString, MaxLength } from 'class-validator';

export class UpdateRestaurantDto {
  @IsString()
  @MaxLength(150)
  name?: string;

  @IsString()
  description?: string;
}
