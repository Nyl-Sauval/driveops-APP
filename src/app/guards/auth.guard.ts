import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | Observable<boolean> {
    if (this.authService.isTokenValid()) {
      console.log('User is authenticated');
      return true;
    }
    this.router.navigate(['/guest']);
    return false;
  }
}
