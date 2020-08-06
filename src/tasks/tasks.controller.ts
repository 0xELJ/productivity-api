import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards, UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { GetTasksDto } from './dto/get-tasks.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskSerializer } from './serializers/TaskSerializer';
import { TaskSerializerCreator } from './TaskSerializerCreator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TaskController');

    constructor(private tasksService: TasksService) {
    }

    @Get()
    getTasks(
        @Query(ValidationPipe) getTasksDto: GetTasksDto,
        @GetUser() user: User,
    ): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks with filters: ${JSON.stringify(getTasksDto)}`);
        return this.tasksService.getTasks(getTasksDto, user);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id')
    async getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<TaskSerializer> {
        const task = await this.tasksService.getTaskById(id, user.id);
        const [serializedTask] = new TaskSerializerCreator([task]).tasks;
        return serializedTask;
    }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(ClassSerializerInterceptor)
    async createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ): Promise<TaskSerializer> {
        this.logger.verbose(`User "${user.username}" creating a new task with data ${JSON.stringify(createTaskDto)}`);
        const task = await this.tasksService.createTask(createTaskDto, user);
        const [serializedTask] = new TaskSerializerCreator([task]).tasks;
        return serializedTask;
    }

    @Delete(':id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<number> {
        this.logger.verbose(`User "${user.username}" deleting task with ID ${id}`);
        return this.tasksService.deleteTask(id, user);
    }

    @Patch(':id/status')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(ClassSerializerInterceptor)
    async updateTask(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTaskDto: UpdateTaskDto,
        @GetUser() user: User,
    ): Promise<TaskSerializer> {
        this.logger.verbose(`User "${user.username}" updating task with ID ${id}`);
        const task = await this.tasksService.updateTask(id, updateTaskDto, user.id);
        const [serializedTask] = new TaskSerializerCreator([task]).tasks;
        return serializedTask;
    }
}
