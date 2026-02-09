import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Invoice, Vehicle } from '../models/models';
import { InvoiceService } from '../services/invoice.service';
import { VehicleService } from '../services/vehicle.service';
import { AuthService } from '../services/auth.service';
import { DocumentCardListComponent } from '../components/document-card-list/document-card-list.component';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterLink,
    FormsModule,
    DocumentCardListComponent
  ],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.scss'
})
export class DocumentListComponent implements OnInit {
  documents: Invoice[] = [];
  filteredDocuments: Invoice[] = [];
  vehicles: Vehicle[] = [];
  loading = true;

  // Filters
  searchQuery = '';
  selectedVehicle = 'all';
  sortBy = 'date-desc';

  constructor(
    private invoiceService: InvoiceService,
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

    // Load documents and vehicles
    this.invoiceService.getInvoicesByUser(userId).subscribe({
      next: (documents) => {
        this.documents = documents;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading documents:', err);
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
    let filtered = [...this.documents];

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.description?.toLowerCase().includes(query)
      );
    }

    // Vehicle filter
    if (this.selectedVehicle !== 'all') {
      filtered = filtered.filter(doc =>
        doc.vehicles?.some(v => v.id === this.selectedVehicle)
      );
    }

    // Sorting
    switch (this.sortBy) {
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'amount-desc':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount-asc':
        filtered.sort((a, b) => a.amount - b.amount);
        break;
    }

    this.filteredDocuments = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onVehicleFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }
}
