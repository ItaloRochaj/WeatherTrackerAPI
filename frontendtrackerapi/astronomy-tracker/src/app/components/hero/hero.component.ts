import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  @Output() dateSelected = new EventEmitter<string>();

  showDatePicker = false;
  selectedDate = '';
  maxDate = new Date().toISOString().split('T')[0];

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
}
