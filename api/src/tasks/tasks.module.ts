import { Module } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { Task, TaskSchema } from 'src/schemas/task.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksController } from './tasks.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      }
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TaskModule {}
