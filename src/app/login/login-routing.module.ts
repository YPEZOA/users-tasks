import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {MainComponent} from './components/main/main.component';
import {MyTasksComponent} from './components/my-tasks/my-tasks.component';
import {TasksComponent} from './components/all-tasks/tasks.component';
import {RegisterComponent} from './components/register/register.component';
import {AuthGuard} from './guards/auth.guard';
import {UpdateUserComponent} from './components/update-user/update-user.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'my-tasks',
        component: MyTasksComponent,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard]
      },
      {
        path: 'tasks',
        component: TasksComponent,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
      },
      {
        path: 'update/:id',
        component: UpdateUserComponent,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard]
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
