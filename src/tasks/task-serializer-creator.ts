import { TaskSerializer } from './serializers/TaskSerializer';
import { Task } from './task.entity';

export class TaskSerializerCreator {
    private serializedTasks: TaskSerializer[];

    constructor(tasks: Task[]) {
        this.serializedTasks = this.serialize(tasks);
    }

    private serialize(tasks: Task[]): TaskSerializer[] {
        return tasks.map(task => this.getSerializedTask(task));
    }

    private getSerializedTask(task: Task): TaskSerializer {
        return new TaskSerializer({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            duration: task.duration,
            timeLeft: task.timeLeft,
            userId: task.userId,
        });
    }

    get tasks(): TaskSerializer[] {
        return this.serializedTasks;
    }
}
