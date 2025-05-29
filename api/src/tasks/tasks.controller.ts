import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { UpdateItemDto } from 'src/items/dto/update-item.dto';

@Controller('tasks')
export class TasksController {
  // tasksService:TasksService;
  // constructor(tasksService: TasksService){
  //     this.tasksService = tasksService;
  // }
  constructor(private taskService: TasksService) {}
  @Get()
  findAll() {
    return this.taskService.findAll();
    // return "get all tasks"
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateTaskDto) {
    return this.taskService.create(body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.taskService.delete(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.taskService.update(id, body);
  }
}
