import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from 'src/schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { UpdateTaskDto } from 'src/dto/update-task.dto';
@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  findAll() {
    return this.taskModel.find();
  }

  async create(createTask: CreateTaskDto) {
    // const ceratedTask = this.taskModel.create(createTask);

    const newTask = new this.taskModel(createTask);
    const createdTask = await newTask.save();
    return createdTask;
  }

  async findOne(id: string) {
    const existingTask = await this.taskModel.findById(id);
    if (!existingTask) throw new Error('Tarea no encontrada');
    return existingTask;
  }

  async delete(id: string) {
    return this.taskModel.findByIdAndDelete(id);
  }

  async update(id: string, task: UpdateTaskDto) {
    const existingTask = await this.taskModel.findById(id);
    if (!existingTask) throw new Error('Tarea no encontrada');

    Object.assign(existingTask, task);

    try {
      return await existingTask.save(); // Aplica validaciones como unique
    } catch (err) {
      if (err.code === 11000) {
        throw new Error('El título ya está en uso.');
      }
      throw err;
    }
    // return this.taskModel.findByIdAndUpdate(id, task, { new: true });
  }
}
