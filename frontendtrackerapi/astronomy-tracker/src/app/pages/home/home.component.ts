import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { AstronomyTodayComponent } from '../../components/astronomy-today/astronomy-today.component';
import { HistoricalDataComponent } from '../../components/historical-data/historical-data.component';
import { AuthCtaComponent } from '../../components/auth-cta/auth-cta.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    AstronomyTodayComponent,
    HistoricalDataComponent,
    AuthCtaComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  selectedDate: string = '2025-10-01';

  onDateSelected(date: string): void {
    this.selectedDate = date;

    // Scroll to astronomy section when date is selected
    setTimeout(() => {
      const astronomySection = document.querySelector('.astronomy-today');
      if (astronomySection) {
        astronomySection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  }
}
