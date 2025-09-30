import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit {
  @Output() dateSelected = new EventEmitter<string>();

  showDatePicker = false;
  selectedDate = '';
  maxDate = new Date().toISOString().split('T')[0];
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated;

    // Subscribe to user changes to update authentication status
    this.authService.currentUser$.subscribe(() => {
      this.isAuthenticated = this.authService.isAuthenticated;
    });
  }

  toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
  }

  onDateChange(): void {
    this.showDatePicker = false;
    this.dateSelected.emit(this.selectedDate);
  }

  viewAstronomyImage(): void {
    this.dateSelected.emit(this.selectedDate || '');
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
