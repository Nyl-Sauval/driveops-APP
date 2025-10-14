import {Component, Input} from '@angular/core';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-resume-card',
  imports: [
    MatCard,
    MatIcon,
  ],
  templateUrl: './resume-card.component.html',
  styleUrl: './resume-card.component.scss'
})
export class ResumeCardComponent {
  @Input() title!: string;
  @Input() icon!: string;
  @Input() value!: string | number;
  @Input() color: string = 'bg-white';
  @Input() subtitle!: string;

  @Input() loading: boolean = false;
}
