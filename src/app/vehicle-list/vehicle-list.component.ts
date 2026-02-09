import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';
import { AuthService } from '../services/auth.service';
import { VehicleCardListComponent } from '../components/vehicle-card-list/vehicle-card-list.component';
import { Vehicle } from '../models/models';

@Component({
    selector: 'app-vehicle-list',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        VehicleCardListComponent,
        RouterLink
    ],
    templateUrl: './vehicle-list.component.html',
    styleUrl: './vehicle-list.component.scss'
})
export class VehicleListComponent implements OnInit {
    vehicles: Vehicle[] = [];
    loading = true;

    constructor(
        private vehicleService: VehicleService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.authService.getMe().subscribe(user => {
            if (user) {
                this.loadVehicles(user.id);
            }
        });
    }

    loadVehicles(userId: string): void {
        this.loading = true;
        this.vehicleService.getVehiclesByUser(userId).subscribe({
            next: (vehicles) => {
                this.vehicles = vehicles;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
        console.log(this.vehicles);
    }

    deleteVehicle(id: string): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
            this.vehicleService.deleteVehicle(id).subscribe(() => {
                this.vehicles = this.vehicles.filter(v => v.id !== id);
            });
        }
    }
}
