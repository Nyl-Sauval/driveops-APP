import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeCardComponent } from '../components/resume-card/resume-card.component';
import { AuthService } from '../services/auth.service';
import { VehicleService } from '../services/vehicle.service';
import { InvoiceService } from '../services/invoice.service';
import { MaintenanceService } from '../services/maintenance.service';
import { VehicleCardListComponent } from '../components/vehicle-card-list/vehicle-card-list.component';
import { DocumentCardListComponent } from '../components/document-card-list/document-card-list.component';
import { MaintenanceCardListComponent } from '../components/maintenance-card-list/maintenance-card-list.component';
import { Vehicle, Invoice, Maintenance } from '../models/models';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    ResumeCardComponent,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    VehicleCardListComponent,
    DocumentCardListComponent,
    MaintenanceCardListComponent,
    RouterLink
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  userId!: string;
  vehicles: Vehicle[] = [];
  recentDocuments: Invoice[] = [];
  upcomingMaintenances: Maintenance[] = [];
  loading = true;

  resumeCardVehicleValue: number | null = null;
  resumeCardMaintenanceValue: number | null = null;
  resumeCardInvoicesValue: number | null = null;
  resumeCardAlertsValue: number | null = null;

  constructor(
    private authService: AuthService,
    private vehicleService: VehicleService,
    private invoiceService: InvoiceService,
    private maintenanceService: MaintenanceService
  ) { }

  ngOnInit(): void {
    this.authService.getMe().subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.loadDashboardData(this.userId);
      }
    });
  }

  private loadDashboardData(userId: string): void {
    this.loading = true;

    // Load all data in parallel
    forkJoin({
      dashboard: this.vehicleService.getDashboardData(userId),
      documents: this.invoiceService.getRecentInvoices(userId, 3),
      maintenances: this.maintenanceService.getUpcomingMaintenances(userId, 3)
    }).subscribe({
      next: (data) => {
        // Update vehicles
        this.vehicles = data.dashboard.vehicles.list;
        this.resumeCardVehicleValue = data.dashboard.vehicles.count;

        // Update maintenances
        this.resumeCardMaintenanceValue = data.dashboard.maintenances.upcoming;
        this.resumeCardAlertsValue = data.dashboard.maintenances.late;

        // Update invoices
        this.resumeCardInvoicesValue = data.dashboard.invoices.count;

        // Update sidebar data
        this.recentDocuments = data.documents;
        this.upcomingMaintenances = data.maintenances;

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading = false;
      }
    });
  }
}
