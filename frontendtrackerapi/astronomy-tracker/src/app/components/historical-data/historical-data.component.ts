import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Star {
  x: number;
  y: number;
  delay: number;
}

@Component({
  selector: 'app-historical-data',
  imports: [CommonModule, RouterModule],
  templateUrl: './historical-data.component.html',
  styleUrl: './historical-data.component.scss'
})
export class HistoricalDataComponent implements OnInit {
  stars: Star[] = [];

  ngOnInit(): void {
    this.generateStars();
  }

  generateStars(): void {
    for (let i = 0; i < 50; i++) {
      this.stars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3
      });
    }
  }
}
