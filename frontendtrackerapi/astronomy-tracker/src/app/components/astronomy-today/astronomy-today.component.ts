import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherTrackerApiService } from '../../services/weather-tracker-api.service';
import { ApodDto } from '../../models/astronomy.models';

@Component({
  selector: 'app-astronomy-today',
  imports: [CommonModule],
  templateUrl: './astronomy-today.component.html',
  styleUrl: './astronomy-today.component.scss'
})
export class AstronomyTodayComponent implements OnInit, OnChanges {
  @Input() selectedDate?: string;

  astronomyData: ApodDto | null = null;
  showOverlay = false;
  error: string | null = null;
  isLoading = false;

  constructor(private apiService: WeatherTrackerApiService) {}

  ngOnInit(): void {
    this.loadAstronomyData();
  }

  ngOnChanges(): void {
    this.loadAstronomyData();
  }

  loadAstronomyData(): void {
    this.error = null;
    this.astronomyData = null;
    this.isLoading = true;

    // Try to get real data first, fallback to mock if needed
    this.apiService.getApod(this.selectedDate).subscribe({
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
