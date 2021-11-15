import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  userData!: any[];
  validLogin!: boolean;

  constructor(private authService: AuthServiceService, private router: Router) {
    this.form = new FormGroup({
      user: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    sessionStorage.clear();
  }

  private validateFields(): void {
    if (this.form.invalid) {
      this.validLogin = false;
      return;
    }
    this.validLogin = true;
  }

  onSubmitForm(e: any): void {
    e.preventDefault();
    this.validateFields();
    const { user, password } = this.form.value;
    if (this.validLogin) {
      this.authService
        .userLogin(user, password)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.validLogin = false;
            Swal.fire({
              icon: 'error',
              text: err.error.message,
              timer: 2000,
              backdrop: false,
              showConfirmButton: false,
            });
            return throwError(err);
          })
        )
        .subscribe((resp: any) => {
          if (resp.status === 1) {
            resp.userData ? (this.userData = resp.userData) : null;
            sessionStorage.setItem('token', resp.token);
            sessionStorage.setItem(
              'userData',
              JSON.stringify(this.userData) || ''
            );
            this.router.navigate(['/auth/profile']);
          }
        });
    } else {
      Swal.fire({
        icon: 'error',
        text: 'Por favor, valida los campos solicitados.',
        width: '600',
        timer: 2000,
        position: 'center',
        showConfirmButton: false,
        backdrop: false,
      });
    }
  }
}
