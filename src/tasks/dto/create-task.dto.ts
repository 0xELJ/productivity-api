import { IsNotEmpty, IsNumber, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
    @IsNotEmpty()
    @MaxLength(120)
    title: string;

    @IsNotEmpty()
    @MaxLength(300)
    description: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(60)
    @Max(7200)
    duration: number;
}
