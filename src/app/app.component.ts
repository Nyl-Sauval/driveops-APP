import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIcon, MatIconButton, MatToolbar, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isDarkTheme = false;

  ngOnInit() {
    document.body.className = this.isDarkTheme ? 'dark-theme' : 'light-theme';
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.className = this.isDarkTheme ? 'dark-theme' : 'light-theme';
  }
}
