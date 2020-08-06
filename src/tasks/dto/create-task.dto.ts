import { IsNotEmpty, IsNotEmptyObject, IsObject, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskTimeDto } from './task-time.dto';

export class CreateTaskDto {
    @IsNotEmpty()
    @MaxLength(120)
    title: string;

    @IsNotEmpty()
    @MaxLength(300)
    description: string;

    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => TaskTimeDto)
    durationTime: TaskTimeDto;
}
