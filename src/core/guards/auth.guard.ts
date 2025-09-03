import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../../app/login/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private readonly loginService: LoginService, 
    private readonly router: Router) {}

  canActivate(): boolean {
    const isLogin = this.loginService.status();

    if (!isLogin) {
      return true; 
    } else {
      this.router.navigate(['employee', 'list']); 
      return false;
    }
  }
}
