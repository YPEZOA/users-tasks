import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { TasksComponent } from './components/all-tasks/tasks.component';
import { MainComponent } from './components/main/main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyTasksComponent } from './components/my-tasks/my-tasks.component';
import { UserImagePipe } from './pipes/user-image.pipe';
import { UpdateUserComponent } from './components/update-user/update-user.component';

@NgModule({
  declarations: [
    RegisterComponent,
    TasksComponent,
    LoginComponent,
    MainComponent,
    MyTasksComponent,
    UserImagePipe,
    UpdateUserComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class LoginModule {}
