import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TaskService } from 'src/app/services/task.service';
import Swal from 'sweetalert2';
import { ITask } from '../../interfaces/task.interface';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss'],
})
export class MyTasksComponent implements OnInit {
  private userId!: string;
  showSpinner!: boolean;
  activeLoading!: boolean;
  backToTasks!: boolean;
  valid!: boolean;
  myTasks!: ITask[];
  newTaskForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private bsModalService: BsModalService
  ) {
    this.newTaskForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(150),
      ]),
    });
    this.backToTasks = true;
  }

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('userData') || '');
    this.userId = user._id || user.userId;
    this.getMyTasks();
  }

  getMyTasks(): void {
    if (this.userId) {
      this.showSpinner = true;
      this.taskService.getUserTasks(this.userId).subscribe((resp) => {
        this.myTasks = resp.data.tasks;
        this.showSpinner = false;
      });
    }
  }

  validateFields(formField: string): void {
    if (this.newTaskForm.get(formField)?.invalid) {
      this.valid = false;
      return;
    }
    this.valid = true;
  }

  onOpenModalRegister(modal: TemplateRef<any>) {
    this.bsModalService.show(modal),
      {
        id: 1,
        backdrop: true,
        class: 'modal-md',
      };
  }

  onSubmitNewTask(): void {
    const { title, description } = this.newTaskForm.value;
    this.valid
      ? this.taskService
          .addTask(title, description, this.userId)
          .subscribe((resp) => {
            if (resp.ok) {
              this.activeLoading = true;
              setTimeout(() => {
                this.getMyTasks();
                Swal.fire({
                  icon: 'success',
                  text: resp.message,
                  backdrop: false,
                  timer: 1500,
                  showConfirmButton: false,
                });
                this.bsModalService.hide();
                this.newTaskForm.reset();
                this.activeLoading = false;
              }, 1800);
            } else {
              console.error('Algo ha ocurrido');
            }
          })
      : Swal.fire({
          icon: 'error',
          text: 'Por favor, valida los campos',
          backdrop: false,
          timer: 1500,
          showConfirmButton: false,
        });
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe((resp) => {
      if (resp.ok) {
        Swal.fire({
          title: 'Tarea eliminada',
          icon: 'success',
          backdrop: false,
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          this.showSpinner = true;
          this.getMyTasks();
        }, 2000);
      }
    });
  }

  updateTask(taskId: string): void {
    this.taskService.updateTask(taskId).subscribe((resp) => {
      if (resp.ok) {
        this.getMyTasks();
        Swal.fire({
          icon: 'success',
          title: 'Tarea completada!',
          text: 'Has terminado tu tarea con éxito',
          backdrop: false,
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Algo ha ocurrido',
          text: 'Intentalo nuevamente!',
          backdrop: false,
          showConfirmButton: false,
          timer: 1800,
        });
      }
    });
  }
}
