import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AstronomyService } from '../../services/astronomy.service';
import { CelestialEvent } from '../../models/astronomy';

@Component({
  selector: 'app-events',
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  events: CelestialEvent[] = [];
  error: string | null = null;

  constructor(private astronomyService: AstronomyService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.error = null;

    this.astronomyService.getMockEvents().subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (err) => {
        this.error = 'Failed to load events. Please try again.';
        console.error('Error loading events:', err);
      }
    });
  }

  getEventImage(type: string): string {
    // Primeiro tenta usar imagens locais, depois fallback para URLs externas
    const localImageMap: { [key: string]: string } = {
      'meteor_shower': 'assets/images/meteor-shower.jpg',
      'lunar_eclipse': 'assets/images/lunar-eclipse.jpg',
      'planetary_alignment': 'assets/images/planetary-alignment.jpg',
      'solar_eclipse': 'assets/images/solar-eclipse.jpg',
      'other': 'assets/images/default-event.jpg'
    };

    // URLs de fallback usando imagens públicas
    const fallbackImageMap: { [key: string]: string } = {
      'meteor_shower': 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=300&fit=crop',
      'lunar_eclipse': 'https://images.unsplash.com/photo-1518066000-e95de0088e28?w=400&h=300&fit=crop',
      'planetary_alignment': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop',
      'solar_eclipse': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'other': 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&h=300&fit=crop'
    };

    // Por enquanto, retorna diretamente o fallback
    return fallbackImageMap[type] || fallbackImageMap['other'];
  }

  getEventTypeLabel(type: string): string {
    const labelMap: { [key: string]: string } = {
      'meteor_shower': 'Meteor Shower',
      'lunar_eclipse': 'Lunar Eclipse',
      'planetary_alignment': 'Planetary Alignment',
      'solar_eclipse': 'Solar Eclipse',
      'other': 'Celestial Event'
    };

    return labelMap[type] || labelMap['other'];
  }

  formatEventDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays > 0) {
      return `In ${diffDays} days`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  retry(): void {
    this.loadEvents();
  }
}
