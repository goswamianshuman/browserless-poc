import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @IsString()
  description?: string;
}
