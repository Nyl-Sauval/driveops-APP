import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Maintenance } from '../../models/models';
import { MaintenanceCardComponent } from '../maintenance-card/maintenance-card.component';

@Component({
  selector: 'app-maintenance-card-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MaintenanceCardComponent
  ],
  templateUrl: './maintenance-card-list.component.html',
  styleUrl: './maintenance-card-list.component.scss'
})
export class MaintenanceCardListComponent {
  @Input() maintenances: Maintenance[] = [];
  @Input() maxDisplay?: number;
  @Input() showEmptyState: boolean = true;

  get displayedMaintenances(): Maintenance[] {
    if (this.maxDisplay && this.maxDisplay > 0) {
      return this.maintenances.slice(0, this.maxDisplay);
    }
    return this.maintenances;
  }
}
