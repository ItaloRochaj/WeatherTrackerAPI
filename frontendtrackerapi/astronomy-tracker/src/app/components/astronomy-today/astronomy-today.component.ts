import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherTrackerApiService } from '../../services/weather-tracker-api.service';
import { ApodDto, UserDto } from '../../models/astronomy.models';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-astronomy-today',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './astronomy-today.component.html',
  styleUrl: './astronomy-today.component.scss'
})
export class AstronomyTodayComponent implements OnInit, OnChanges {
  @Input() selectedDate?: string;

  astronomyData: ApodDto | null = null;
  showOverlay = false;
  error: string | null = null;
  isLoading = false;
  isAuthenticated = false;

  constructor(
    private apiService: WeatherTrackerApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Verifica o estado inicial de autenticação
    this.isAuthenticated = this.authService.isAuthenticated;

    // Para usuários não autenticados, mostra a imagem padrão
    if (!this.isAuthenticated) {
      this.selectedDate = '2025-09-30';
    } else {
      // Para usuários autenticados, mostra a imagem do Witch's Broom Nebula
      this.selectedDate = '2025-10-01';
    }

    this.loadAstronomyData();

    // Observa mudanças no estado de autenticação através do usuário atual
    this.authService.currentUser$.subscribe((user: UserDto | null) => {
      this.isAuthenticated = !!user;
      if (!this.isAuthenticated) {
        this.selectedDate = '2025-09-30';
        this.loadAstronomyData();
      }
    });
  }  ngOnChanges(): void {
    // Carrega os dados apenas se a data selecionada for diferente da padrão
    if (this.selectedDate && this.selectedDate !== '2025-10-01') {
      this.loadAstronomyData();
    }
  }

  loadAstronomyData(): void {
    this.error = null;
    this.astronomyData = null;
    this.isLoading = true;

    // Formatar a data no formato YYYY-MM-DD
    let formattedDate = this.selectedDate;
    if (formattedDate) {
      const date = new Date(formattedDate);
      formattedDate = date.toISOString().split('T')[0];
    }

    // Try to get real data first, fallback to mock if needed
    this.apiService.getApod(formattedDate).subscribe({
      next: (data: ApodDto) => {
        this.astronomyData = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load astronomy data. Please try again.';
        this.isLoading = false;
        console.error('Error loading astronomy data:', err);
      }
    });
  }

  onImageLoad(): void {
    this.showOverlay = true;
  }

  onImageError(): void {
    this.error = 'Failed to load image.';
  }

  viewFullImage(): void {
    if (this.astronomyData?.hdUrl || this.astronomyData?.url) {
      const imageUrl = this.astronomyData.hdUrl || this.astronomyData.url;
      window.open(imageUrl, '_blank');
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  retry(): void {
    this.loadAstronomyData();
  }

  onDateSelect(date: string): void {
    if (this.isAuthenticated) {
      this.selectedDate = date;
      this.loadAstronomyData();
    }
  }

  onToggleFavorite(): void {
    if (this.astronomyData?.id) {
      this.apiService.toggleFavorite(this.astronomyData.id).subscribe({
        next: (updatedApod: ApodDto) => {
          this.astronomyData = updatedApod;
        },
        error: (error: any) => {
          console.error('Error toggling favorite:', error);
        }
      });
    }
  }

  onRateImage(rating: number): void {
    if (this.astronomyData?.id) {
      this.apiService.updateRating(this.astronomyData.id, rating).subscribe({
        next: (updatedApod: ApodDto) => {
          this.astronomyData = updatedApod;
        },
        error: (error: any) => {
          console.error('Error updating rating:', error);
        }
      });
    }
  }
}
