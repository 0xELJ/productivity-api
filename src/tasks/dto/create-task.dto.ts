import { IsNotEmpty, IsNotEmptyObject, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskTimeDto } from './task-time.dto';

export class CreateTaskDto {
    @IsNotEmpty()
    @MaxLength(120)
    title: string;

    @IsNotEmpty()
    @MaxLength(300)
    description: string;

    @IsNotEmptyObject()
    @Type(() => TaskTimeDto)
    durationTime: TaskTimeDto;
}
