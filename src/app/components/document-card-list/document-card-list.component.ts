import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Invoice } from '../../models/models';
import { DocumentCardComponent } from '../document-card/document-card.component';

@Component({
  selector: 'app-document-card-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    DocumentCardComponent
  ],
  templateUrl: './document-card-list.component.html',
  styleUrl: './document-card-list.component.scss'
})
export class DocumentCardListComponent {
  @Input() documents: Invoice[] = [];
  @Input() maxDisplay?: number;
  @Input() showEmptyState: boolean = true;

  get displayedDocuments(): Invoice[] {
    if (this.maxDisplay && this.maxDisplay > 0) {
      return this.documents.slice(0, this.maxDisplay);
    }
    return this.documents;
  }
}
