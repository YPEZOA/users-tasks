import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | boolean {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigateByUrl('/auth/login');
      return false;
    }
    return true;
  }

  canLoad(): Observable<boolean> | boolean {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigateByUrl('/auth/login');
      return false;
    }
    return true;
  }
}
