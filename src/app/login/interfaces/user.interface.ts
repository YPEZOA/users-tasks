import {ITask} from "./task.interface";

export interface IUser {
  _id: string,
  email: string,
  user: string,
  password: string,
  tasks?: Array<ITask>
}
