import {Component, OnInit} from '@angular/core';
import {TaskService} from 'src/app/services/task.service';
import {ITask} from '../../interfaces/task.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userData: any;
  tasks!: ITask[];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.getUserData();
    this.getAllTasks();
  }

  getUserData(): void {
    const data = sessionStorage.getItem('userData');
    this.userData = JSON.parse(data || '');
  }

  getAllTasks(): void {
    this.taskService.getTasks().subscribe(resp => {
      this.tasks = resp.data
      console.log(resp.data)
    })
  }
}
