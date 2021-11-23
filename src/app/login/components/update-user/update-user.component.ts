import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthServiceService} from 'src/app/services/auth-service.service';
import {ValidatorService} from 'src/app/services/validator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  userUpdateForm!: FormGroup;

  constructor(private authService: AuthServiceService, private route: ActivatedRoute, private validatorService: ValidatorService, private router: Router) {}

  ngOnInit(): void {
    this.userUpdateForm = new FormGroup({
      email: new FormControl('', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'), Validators.required]),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      password2: new FormControl('', Validators.required)
    }, {
      validators: [this.validatorService.validateEqualsPassword('password', 'password2')]
    });

    this.getUserData()
  }

  public validateFields(field: string) {
    if (this.userUpdateForm.get(field)?.touched && this.userUpdateForm.get(field)?.invalid) {
      return true;
    }
    return;
  }

  public onSubmitUpdate(): void {
    this.userUpdateForm.markAllAsTouched();
    this.userUpdateForm.valid ? this.userPayloadToUpdate(this.userUpdateForm.value) : null
  }

  public updateUser(payload: any): void {
    const userId = this.route.snapshot.paramMap.get('id')
    this.authService.updateUser(userId, payload).subscribe(resp => {
      if (resp.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Modificación exitosa',
          text: 'Redirigiendo...',
          backdrop: false,
          showConfirmButton: false,
          timer: 2300
        })
        setTimeout(() => {
          this.router.navigate(['/auth/tasks'])
        }, 2300)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ups!',
          text: 'Algo ha ocurrido, por favor intentalo denuevo',
          showConfirmButton: false,
          backdrop: false,
          timer: 2300
        })
      }
    })
  }

  public userPayloadToUpdate(form: any): void {
    const payload = {
      user: form.username,
      email: form.email,
      password: form.password,
    }
    this.updateUser(payload);
  }

  private getUserData(): void {
    const userId = this.route.snapshot.paramMap.get('id')
    this.authService.getUserDataById(userId || '').subscribe(resp => {
      const user = resp.user
      this.userUpdateForm.get('email')?.setValue(user.email)
      this.userUpdateForm.get('username')?.setValue(user.user)
    })
  }

}
