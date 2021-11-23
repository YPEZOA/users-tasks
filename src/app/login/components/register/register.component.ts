import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthServiceService} from 'src/app/services/auth-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  formValid!: boolean;
  emailValid!: boolean;
  userData!: any[];

  constructor(private authService: AuthServiceService, private router: Router) {
    this.registerForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
        ),
      ]),
      user: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  validateFields(field: string) {
    if (
      this.registerForm.get(field)?.touched &&
      this.registerForm.get(field)?.invalid
    ) {
      return true;
    }
    return;
  }

  onSubmitRegister(e: Event): void {
    e.preventDefault();
    this.validateForm();
    this.registerForm.markAllAsTouched();

    const {email, user, password} = this.registerForm.value;
    if (this.formValid) {
      this.authService.registerUser(email, user, password)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            Swal.fire({
              icon: 'error',
              text: err.error.message,
              showConfirmButton: false,
              backdrop: false,
              timer: 2000
            })
            return throwError(err)
          })
        )
        .subscribe((resp: any) => {
          if (resp.ok) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Registrado con exito!',
              timer: 1700,
              showConfirmButton: false,
            });
            resp.userData ? (this.userData = resp.userData) : null;
            this.router.navigate(['/auth/tasks']);
            sessionStorage.setItem('token', resp.token);
            sessionStorage.setItem('userData', JSON.stringify(this.userData));
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Algo ha ocurrido',
              text: 'Por favor, intentalo denuevo',
              backdrop: false,
            });
          }
        });
    } else {
      Swal.fire({
        icon: 'error',
        text: 'Por favor, valida los campos solicitados',
        timer: 1700,
        showConfirmButton: false,
        backdrop: false,
      });
    }
  }

  private validateForm(): void {
    if (this.registerForm.invalid) {
      this.formValid = false;
      return;
    }
    this.formValid = true;
  }
}
