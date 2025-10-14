import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIcon, MatIconButton, MatToolbar, MatButton, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isDarkTheme = false;
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    document.body.className = this.isDarkTheme ? 'dark-theme' : 'light-theme';
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user || this.authService.isAuthenticated();
    });
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.className = this.isDarkTheme ? 'dark-theme' : 'light-theme';
  }

  logout() {
    this.authService.logout();
  }
}
