import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateMealDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    price: number;
}
