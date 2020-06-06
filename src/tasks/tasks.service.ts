import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepo: TaskRepository,
  ) {}

  async getTasks(getTasksDto: GetTasksDto): Promise<Task[]> {
    return this.taskRepo.getTasks(getTasksDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepo.findOne(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepo.createTask(createTaskDto);
  }

  async deleteTask(id: number): Promise<number> {
    const deletedTask = await this.taskRepo.delete(id);

    if (!deletedTask.affected) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return id;
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }
}
