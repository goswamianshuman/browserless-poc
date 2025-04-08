// src/meals/dto/create-meal.dto.ts
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateMealDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;
}
