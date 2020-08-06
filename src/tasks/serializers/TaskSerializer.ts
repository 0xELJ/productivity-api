import { TaskStatus } from '../task-status.enum';
import { Exclude, Expose } from 'class-transformer';
import { TaskTimeDto } from '../dto/task-time.dto';

export class TaskSerializer {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;

    @Exclude()
    duration: number;

    @Exclude()
    timeLeft: number;

    @Exclude()
    userId: number;

    @Expose()
    get durationTime() {
        const time = new TaskTimeDto(this.duration);
        return { hours: time.hours, minutes: time.minutes, seconds: time.seconds };
    }

    @Expose()
    get remainingTime() {
        const time = new TaskTimeDto(this.timeLeft);
        return { hours: time.hours, minutes: time.minutes, seconds: time.seconds };
    }

    constructor(partial: Partial<TaskSerializer>) {
        Object.assign(this, partial);
    }
}
