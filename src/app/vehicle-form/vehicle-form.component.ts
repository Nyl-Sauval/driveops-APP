import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VehicleService } from '../services/vehicle.service';
import { AuthService } from '../services/auth.service';
import { Vehicle } from '../models/models';

@Component({
    selector: 'app-vehicle-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        RouterLink
    ],
    templateUrl: './vehicle-form.component.html',
    styleUrl: './vehicle-form.component.scss'
})
export class VehicleFormComponent implements OnInit {
    vehicleForm: FormGroup;
    isEditMode = false;
    vehicle_id: string | null = null;
    user_id: string | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private vehicleService: VehicleService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.vehicleForm = this.fb.group({
            name: ['', [Validators.required]],
            brand: ['', [Validators.required]],
            model: ['', [Validators.required]],
            year: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
            license_plate: ['', [Validators.required]],
            mileage: [0, [Validators.min(0)]],
            purchase_date: ['']
        });
    }

    ngOnInit(): void {
        this.authService.getMe().subscribe(user => {
            if (user) {
                this.user_id = user.id;
            }
        });

        this.vehicle_id = this.route.snapshot.paramMap.get('id');
        if (this.vehicle_id) {
            this.isEditMode = true;
            this.loadVehicle(this.vehicle_id);
        }
    }

    loadVehicle(id: string): void {
        this.loading = true;
        this.vehicleService.getVehicleById(id).subscribe({
            next: (vehicle) => {
                this.vehicleForm.patchValue(vehicle);
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.router.navigate(['/vehicles']);
            }
        });
    }

    onSubmit(): void {
        if (this.vehicleForm.invalid || !this.user_id) return;

        this.loading = true;
        console.log(this.vehicleForm.value);
        console.log(this.user_id);
        const vehicleData = {
            ...this.vehicleForm.value,
            user_id: this.user_id
        };

        console.log(vehicleData);

        if (this.isEditMode && this.vehicle_id) {
            this.vehicleService.updateVehicle(this.vehicle_id, vehicleData).subscribe({
                next: () => {
                    this.loading = false;
                    this.router.navigate(['/vehicles']);
                },
                error: () => this.loading = false
            });
        } else {
            this.vehicleService.createVehicle(vehicleData).subscribe({
                next: () => {
                    this.loading = false;
                    this.router.navigate(['/vehicles']);
                },
                error: () => this.loading = false
            });
        }
    }
}
