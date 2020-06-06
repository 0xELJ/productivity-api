import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksDto } from './dto/get-tasks.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(getTasksDto: GetTasksDto): Promise<Task[]> {
    const { status, searchTerm } = getTasksDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (searchTerm) {
      query.andWhere(
        'task.title LIKE :searchTerm OR task.description LIKE :searchTerm',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    return await query.getMany();
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();

    return task;
  }
}
