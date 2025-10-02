import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { VisiteurComponent } from './visiteur/visiteur.component';
import { AuthGuard } from './guards/auth.guard';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {GuestGuard} from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: HomepageComponent, canActivate: [AuthGuard] },
  { path: 'guest', component: VisiteurComponent, canActivate: [GuestGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent}

];
