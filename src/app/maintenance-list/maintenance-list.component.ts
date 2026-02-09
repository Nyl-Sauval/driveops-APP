import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Maintenance, Vehicle } from '../models/models';
import { MaintenanceService } from '../services/maintenance.service';
import { VehicleService } from '../services/vehicle.service';
import { AuthService } from '../services/auth.service';
import { MaintenanceCardListComponent } from '../components/maintenance-card-list/maintenance-card-list.component';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    RouterLink,
    FormsModule,
    MaintenanceCardListComponent
  ],
  templateUrl: './maintenance-list.component.html',
  styleUrl: './maintenance-list.component.scss'
})
export class MaintenanceListComponent implements OnInit {
  maintenances: Maintenance[] = [];
  filteredMaintenances: Maintenance[] = [];
  vehicles: Vehicle[] = [];
  loading = true;

  // Filters
  searchQuery = '';
  statusFilter = 'all'; // all, upcoming, done, late
  selectedVehicle = 'all';
  sortBy = 'date-desc';

  constructor(
    private maintenanceService: MaintenanceService,
    private vehicleService: VehicleService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.getMe().subscribe(user => {
      if (user) {
        this.loadData(user.id);
      }
    });
  }

  private loadData(userId: string): void {
    this.loading = true;

    // Load maintenances
    this.maintenanceService.getMaintenancesByUser(userId).subscribe({
      next: (maintenances) => {
        this.maintenances = maintenances;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading maintenances:', err);
        this.loading = false;
      }
    });

    // Load vehicles for filter
    this.vehicleService.getVehiclesByUser(userId).subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
      },
      error: (err) => {
        console.error('Error loading vehicles:', err);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.maintenances];

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.description?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(m => this.getMaintenanceStatus(m) === this.statusFilter);
    }

    // Vehicle filter
    if (this.selectedVehicle !== 'all') {
      filtered = filtered.filter(m =>
        m.vehicles?.some(v => v.id === this.selectedVehicle)
      );
    }

    // Sorting
    switch (this.sortBy) {
      case 'date-desc':
        filtered.sort((a, b) => {
          const dateA = a.scheduled_date ? new Date(a.scheduled_date).getTime() : 0;
          const dateB = b.scheduled_date ? new Date(b.scheduled_date).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'date-asc':
        filtered.sort((a, b) => {
          const dateA = a.scheduled_date ? new Date(a.scheduled_date).getTime() : 0;
          const dateB = b.scheduled_date ? new Date(b.scheduled_date).getTime() : 0;
          return dateA - dateB;
        });
        break;
    }

    this.filteredMaintenances = filtered;
  }

  getMaintenanceStatus(maintenance: Maintenance): string {
    if (maintenance.done) return 'done';

    if (maintenance.scheduled_date) {
      const scheduledDate = new Date(maintenance.scheduled_date);
      const today = new Date();
      if (scheduledDate < today) return 'late';
      return 'upcoming';
    }

    return 'upcoming';
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onVehicleFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  getStatusCount(status: string): number {
    return this.maintenances.filter(m => this.getMaintenanceStatus(m) === status).length;
  }
}
