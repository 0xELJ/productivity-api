import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { User } from '../auth/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository) private taskRepo: TaskRepository,
    ) {}

    async getTasks(getTasksDto: GetTasksDto, user: User): Promise<Task[]> {
        return this.taskRepo.getTasks(getTasksDto, user);
    }

    async getTaskById(id: number, userId: number): Promise<Task> {
        const task = await this.taskRepo.findOne({ where: { id, userId } });

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return task;
    }

    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepo.createTask(createTaskDto, user);
    }

    async deleteTask(id: number, user: User): Promise<number> {
        const deletedTask = await this.taskRepo.delete({ id, userId: user.id });

        if (!deletedTask.affected) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return id;
    }

    async updateTask(id: number, updateTaskDto: UpdateTaskDto, userId: number): Promise<Task> {
        const task = await this.getTaskById(id, userId);
        return await this.taskRepo.updateTask(task, updateTaskDto);
    }
}
