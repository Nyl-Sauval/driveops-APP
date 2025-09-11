import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { VisiteurComponent } from './visiteur/visiteur.component';
import { AuthGuard } from './guards/auth.guard';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/visiteur', pathMatch: 'full' },
  { path: 'homepage', component: HomepageComponent, canActivate: [AuthGuard] },
  { path: 'visiteur', component: VisiteurComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent}

];
