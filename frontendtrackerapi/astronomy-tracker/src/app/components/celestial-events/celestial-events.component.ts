import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AstronomyService } from '../../services/astronomy.service';
import { CelestialEvent } from '../../models/astronomy';

@Component({
  selector: 'app-celestial-events',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './celestial-events.component.html',
  styleUrl: './celestial-events.component.scss'
})
export class CelestialEventsComponent implements OnInit {
  events: CelestialEvent[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private astronomyService: AstronomyService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;

    this.astronomyService.getMockEvents().subscribe({
      next: (data) => {
        // Show only the next 3 upcoming events for the home page
        this.events = data.slice(0, 3);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load events';
        this.loading = false;
        console.error('Error loading events:', err);
      }
    });
  }

  getEventTypeColor(type: string): string {
    const colorMap: { [key: string]: string } = {
      'meteor_shower': '#ff6b6b',
      'lunar_eclipse': '#4ecdc4',
      'planetary_alignment': '#45b7d1',
      'solar_eclipse': '#f39c12',
      'other': '#95a5a6'
    };
    return colorMap[type] || colorMap['other'];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  getDaysUntil(dateString: string): number {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}
