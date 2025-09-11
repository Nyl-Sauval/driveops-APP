import { Component } from '@angular/core';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-visiteur',
  templateUrl: './visiteur.component.html',
  imports: [
    MatCard,
    MatIcon,
    NgForOf,
    MatButton,
    RouterLink
  ],
  styleUrls: ['./visiteur.component.scss']
})
export class VisiteurComponent {
  features = [
    {
      icon: 'build',
      color: 'orange',
      title: 'Suivi des entretiens',
      description: 'Planifiez vos entretiens en fonction du temps ou du kilométrage.'
    },
    {
      icon: 'receipt',
      color: 'red',
      title: 'Gestion des factures',
      description: 'Centralisez vos factures et pièces pour un suivi optimal.'
    },
    {
      icon: 'directions_car',
      color: 'primary',
      title: 'Gestion de flotte',
      description: 'Suivez l’état et l’historique de vos véhicules.'
    },
    {
      icon: 'dashboard',
      color: 'black',
      title: 'Tableau de bord',
      description: 'Visualisez rapidement les informations clés.'
    }
  ];
}
