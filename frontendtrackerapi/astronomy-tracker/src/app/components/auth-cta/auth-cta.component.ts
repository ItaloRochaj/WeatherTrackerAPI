import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-cta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-cta.component.html',
  styleUrl: './auth-cta.component.scss'
})
export class AuthCtaComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
