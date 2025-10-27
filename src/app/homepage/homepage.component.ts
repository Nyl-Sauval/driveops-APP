import {Component, OnInit} from '@angular/core';
import {ResumeCardComponent} from '../components/resume-card/resume-card.component';
import {AuthService} from '../services/auth.service';
import {VehicleService} from '../services/vehicle.service';
import {MaintenanceService} from '../services/maintenance.service';

@Component({
  selector: 'app-homepage',
  imports: [
    ResumeCardComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  userId!: string;

  resumeCardVehicleValue: number | null = null;
  resumeCardMaintenanceValue: number | null = null;
  resumeCardInvoicesValue: number | null = null;
  resumeCardAlertsValue: number | null = null;

  constructor(
    private authService: AuthService,
    private vehicleService: VehicleService,
    private maintenanceService: MaintenanceService
  ) {
  }

  ngOnInit(): void {
    this.authService.getMe().subscribe(user => {
      if (user) {
        this.userId = user.id;

        // Charger les données du dashboard seulement après avoir reçu l'ID
        this.loadDashboardData(this.userId);
      } else {
        console.log('No user logged in');
      }
    });
  }

  private loadDashboardData(userId: string): void {
    console.log('Loading dashboard data for user:', userId);
    this.vehicleService.getVehiclesByUser(userId).subscribe(vehicules => {
      this.resumeCardVehicleValue = vehicules.length;
      console.log('Vehicles loaded:', vehicules);
    });
    this.maintenanceService.getMaintenancesByUser(userId).subscribe(maintenances => {
      this.resumeCardMaintenanceValue = maintenances.length;
      console.log('Maintenances loaded:', maintenances);
    });
    // Simuler les autres valeurs pour l'instant
    this.resumeCardInvoicesValue = 3; // Exemple statique
    this.resumeCardAlertsValue = 2; // Exemple statique
  }
}
