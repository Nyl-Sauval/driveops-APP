import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { VisiteurComponent } from './visiteur/visiteur.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GuestGuard } from './guards/guest.guard';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleFormComponent } from './vehicle-form/vehicle-form.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentDetailComponent } from './document-detail/document-detail.component';
import { MaintenanceListComponent } from './maintenance-list/maintenance-list.component';
import { MaintenanceDetailComponent } from './maintenance-detail/maintenance-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: HomepageComponent, canActivate: [AuthGuard] },
  { path: 'guest', component: VisiteurComponent, canActivate: [GuestGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'vehicles',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: VehicleListComponent },
      { path: 'add', component: VehicleFormComponent },
      { path: 'edit/:id', component: VehicleFormComponent }
    ]
  },
  {
    path: 'documents',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DocumentListComponent },
      { path: ':id', component: DocumentDetailComponent }
      // TODO: Add document form component
      // { path: 'add', component: DocumentFormComponent },
    ]
  },
  {
    path: 'maintenances',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: MaintenanceListComponent },
      { path: ':id', component: MaintenanceDetailComponent }
      // TODO: Add maintenance form component
      // { path: 'add', component: MaintenanceFormComponent },
    ]
  }
];
