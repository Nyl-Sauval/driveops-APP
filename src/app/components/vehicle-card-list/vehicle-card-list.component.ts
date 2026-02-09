import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Vehicle } from '../../models/models';

@Component({
    selector: 'app-vehicle-card-list',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        RouterLink
    ],
    templateUrl: './vehicle-card-list.component.html',
    styleUrl: './vehicle-card-list.component.scss'
})
export class VehicleCardListComponent {
    @Input() vehicles: Vehicle[] = [];
    @Input() maxDisplay?: number;
    @Input() showEmptyState: boolean = true;

    get displayedVehicles(): Vehicle[] {
        if (this.maxDisplay && this.maxDisplay > 0) {
            return this.vehicles.slice(0, this.maxDisplay);
        }
        return this.vehicles;
    }
}
