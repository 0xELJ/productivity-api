import { IsIn, IsObject, IsOptional, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../task-status.enum';
import { TaskTimeDto } from './task-time.dto';

export class UpdateTaskDto {
    @IsOptional()
    @MaxLength(120)
    title: string;

    @IsOptional()
    @MaxLength(300)
    description: string;

    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status: TaskStatus;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => TaskTimeDto)
    durationTime: TaskTimeDto;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => TaskTimeDto)
    remainingTime: TaskTimeDto;
}
