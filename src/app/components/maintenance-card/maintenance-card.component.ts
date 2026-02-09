import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Maintenance } from '../../models/models';

@Component({
  selector: 'app-maintenance-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: './maintenance-card.component.html',
  styleUrl: './maintenance-card.component.scss'
})
export class MaintenanceCardComponent {
  @Input() maintenance!: Maintenance;

  getStatusClass(): string {
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
    switch (this.maintenance.type) {
      case 'mileage': return 'Selon kilométrage';
      case 'time': return 'Selon temps';
      case 'one_time': return 'Ponctuel';
      default: return this.maintenance.type;
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'Non planifié';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  formatCost(cost: number | undefined): string {
    if (!cost) return '';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(cost);
  }
}
