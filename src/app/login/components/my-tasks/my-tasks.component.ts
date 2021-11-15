import {Component, OnInit} from '@angular/core';
import {TaskService} from 'src/app/services/task.service';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss']
})
export class MyTasksComponent implements OnInit {
  private userId!: string;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('userData') || '')
    this.userId = user.userId
    if (this.userId) {
      this.taskService.getUserTasks(this.userId)
      .subscribe(resp => console.log(resp))
    }
  }

}
