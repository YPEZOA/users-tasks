import {Component, OnInit} from '@angular/core';
import {AuthServiceService} from 'src/app/services/auth-service.service';
import {TaskService} from 'src/app/services/task.service';
import {ITask} from '../../interfaces/task.interface';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  userData: any;
  tasks!: ITask[];
  tasksUser!: string;

  constructor(private taskService: TaskService, private authService: AuthServiceService) {}

  ngOnInit(): void {
    this.getUserData();
    this.getAllTasks();
  }

  getUserData(): void {
    const data = JSON.parse(sessionStorage.getItem('userData') || '');
    this.authService.getUserDataById(data._id || data.userId).subscribe(resp => {
      if (resp.ok) {
        this.userData = resp.user
      } else {
        console.error('Algo a ocurrido')
      }
    })
  }

  getAllTasks(): void {
    this.taskService.getTasks().subscribe(resp => {
      this.tasks = resp.tasks
    })
  }
}
