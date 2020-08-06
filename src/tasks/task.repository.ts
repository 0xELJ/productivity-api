import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksDto } from './dto/get-tasks.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    private logger = new Logger('TaskRepository');

    async getTasks(getTasksDto: GetTasksDto, user: User): Promise<Task[]> {
        const { status, searchTerm } = getTasksDto;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', { userId: user.id });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }
        if (searchTerm) {
            query.andWhere(
                'task.title LIKE :searchTerm OR task.description LIKE :searchTerm',
                { searchTerm: `%${searchTerm}%` },
            );
        }

        try {
            return await query.getMany();
        } catch (error) {
            this.logger.error(
                `Failed to get tasks for user "${user.username}" with filters ${JSON.stringify(getTasksDto)}"`,
                error.stack,
            );
            throw new InternalServerErrorException();
        }

    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description, durationTime } = createTaskDto;
        const task = new Task();

        task.title = title;
        task.description = description;
        task.duration = durationTime.timeToSeconds();
        task.timeLeft = durationTime.timeToSeconds();
        task.status = TaskStatus.OPEN;
        task.user = user;

        try {
            await task.save();
        } catch (error) {
            this.logger.error(
                `Failed to create a task for user "${user.username}" with data ${createTaskDto}`,
                error.stack,
            );
            throw new InternalServerErrorException();
        }

        delete task.user;
        return task;
    }

    async updateTask(task: Task, updateTaskDto: UpdateTaskDto): Promise<Task> {
        const { title, description, status, durationTime, remainingTime } = updateTaskDto;

        if (title) {
            task.title = title;
        }
        if (description) {
            task.description = description;
        }
        if (status) {
            task.status = status;
        }
        if (durationTime) {
            task.duration = durationTime.timeToSeconds();
            task.timeLeft = durationTime.timeToSeconds();
        }
        if (remainingTime) {
            task.timeLeft = remainingTime.timeToSeconds();
        }

        await task.save();
        return task;
    }
}
