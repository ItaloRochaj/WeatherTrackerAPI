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
  loading: boolean = false;

  constructor(private astronomyService: AstronomyService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;

    this.astronomyService.getMockEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load events. Please try again.';
        this.loading = false;
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
      'lunar_eclipse': 'https://unsplash.com/pt-br/fotografias/solar-eclipse-7YiZKj9A3DM',
      'planetary_alignment': 'https://unsplash.com/pt-br/fotografias/tres-circulos-de-cores-diferentes-em-um-fundo-preto-lJu79_jOnTM',
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

  refreshEvents(): void {
    this.loadEvents();
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
      year: 'numeric',
      month: 'long',
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
