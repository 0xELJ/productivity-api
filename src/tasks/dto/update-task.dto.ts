import { IsIn, IsNumber, IsOptional, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../task-status.enum';

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
  @Type(() => Number)
  @IsNumber()
  @Min(60)
  @Max(7200)
  duration: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(60)
  @Max(7200)
  timeLeft: number;
}
