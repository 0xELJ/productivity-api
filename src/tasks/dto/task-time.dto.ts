import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TaskTimeDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(2)
    hours: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(59)
    minutes: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(59)
    seconds: number;

    constructor(totalSeconds: number) {
        const { hours, minutes, seconds } = this.secondsToTime(totalSeconds);
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }

    secondsToTime(totalSeconds: number): { hours: number, minutes: number, seconds: number } {
        let hours: number;
        let minutes: number;
        let seconds: number;

        hours = Math.floor(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;
        minutes = Math.floor(totalSeconds / 60);
        seconds = totalSeconds % 60;

        return { hours, minutes, seconds };
    }

    timeToSeconds(): number {
        return this.hours * 3600 + this.minutes * 60 + this.seconds;
    }
}
