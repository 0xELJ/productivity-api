import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

@Injectable()
export class TaskStatusPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ];

    transform(value: string) {
        value = value.toUpperCase();
        const isStatusValid = this.validateStatus(value);

        if (!isStatusValid) {
            throw new BadRequestException(`Status "${value} is invalid"`);
        }

        return value;
    }

    private validateStatus(status: any) {
        return this.allowedStatuses.includes(status);
    }
}
