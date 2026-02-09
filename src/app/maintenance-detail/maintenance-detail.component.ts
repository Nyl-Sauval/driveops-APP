import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Maintenance } from '../models/models';
import { MaintenanceService } from '../services/maintenance.service';

@Component({
  selector: 'app-maintenance-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ],
  templateUrl: './maintenance-detail.component.html',
  styleUrl: './maintenance-detail.component.scss'
})
export class MaintenanceDetailComponent implements OnInit {
  maintenance: Maintenance | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private maintenanceService: MaintenanceService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMaintenance(id);
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  private loadMaintenance(id: string): void {
    this.loading = true;
    this.maintenanceService.getMaintenance(id).subscribe({
      next: (maintenance) => {
        this.maintenance = maintenance;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading maintenance:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getStatusClass(): string {
    if (!this.maintenance) return '';

    if (this.maintenance.done) return 'done';

    if (this.maintenance.scheduled_date) {
      const scheduledDate = new Date(this.maintenance.scheduled_date);
      const today = new Date();
      if (scheduledDate < today) return 'late';
      return 'upcoming';
    }

    return 'upcoming';
  }

  getStatusLabel(): string {
    const status = this.getStatusClass();
    switch (status) {
      case 'done': return 'Terminé';
      case 'late': return 'En retard';
      case 'upcoming': return 'À venir';
      default: return '';
    }
  }

  getStatusIcon(): string {
    const status = this.getStatusClass();
    switch (status) {
      case 'done': return 'check_circle';
      case 'late': return 'warning';
      case 'upcoming': return 'schedule';
      default: return 'build';
    }
  }

  getTypeLabel(): string {
    if (!this.maintenance) return '';

    switch (this.maintenance.type) {
      case 'mileage': return 'Selon kilométrage';
      case 'time': return 'Selon temps';
      case 'one_time': return 'Ponctuel';
      default: return this.maintenance.type;
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'Non planifié';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  formatCost(cost: number | undefined): string {
    if (!cost) return 'Non spécifié';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(cost);
  }

  markAsDone(): void {
    if (!this.maintenance || this.maintenance.done) return;

    const doneDate = new Date().toISOString().split('T')[0];
    const doneMileage = undefined; // TODO: Prompt user for mileage

    this.maintenanceService.markAsDone(this.maintenance.id, doneDate, doneMileage).subscribe({
      next: (updatedMaintenance) => {
        this.maintenance = updatedMaintenance;
        alert('Entretien marqué comme terminé !');
      },
      error: (err) => {
        console.error('Error marking maintenance as done:', err);
        alert('Erreur lors de la mise à jour');
      }
    });
  }

  deleteMaintenance(): void {
    if (!this.maintenance) return;

    const confirm = window.confirm('Êtes-vous sûr de vouloir supprimer cet entretien ?');
    if (confirm) {
      this.maintenanceService.deleteMaintenance(this.maintenance.id).subscribe({
        next: () => {
          this.router.navigate(['/maintenances']);
        },
        error: (err) => {
          console.error('Error deleting maintenance:', err);
          alert('Erreur lors de la suppression');
        }
      });
    }
  }
}
