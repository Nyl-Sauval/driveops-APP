import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { Invoice } from '../models/models';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule
  ],
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.scss'
})
export class DocumentDetailComponent implements OnInit {
  document: Invoice | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDocument(id);
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  private loadDocument(id: string): void {
    this.loading = true;
    this.invoiceService.getInvoice(id).subscribe({
      next: (document) => {
        this.document = document;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading document:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  downloadDocument(): void {
    if (this.document) {
      this.invoiceService.downloadInvoice(this.document.id);
      // TODO: Implement actual download logic
      alert('Fonctionnalité de téléchargement à venir. Le fichier sera téléchargé prochainement.');
    }
  }

  deleteDocument(): void {
    if (!this.document) return;

    const confirm = window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?');
    if (confirm) {
      this.invoiceService.deleteInvoice(this.document.id).subscribe({
        next: () => {
          this.router.navigate(['/documents']);
        },
        error: (err) => {
          console.error('Error deleting document:', err);
          alert('Erreur lors de la suppression du document');
        }
      });
    }
  }

  getFileIcon(): string {
    if (!this.document?.file_path) return 'description';

    const ext = this.document.file_path.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'picture_as_pdf';
      case 'jpg':
      case 'jpeg':
      case 'png': return 'image';
      default: return 'description';
    }
  }
}
