import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AstronomyService } from '../../services/astronomy.service';
import { HistoricalData } from '../../models/astronomy';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule, FormsModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
  galleryItems: HistoricalData[] = [];
  selectedItem: HistoricalData | null = null;

  searchQuery = '';
  startDate = '';
  endDate = '';

  isLoading = false;
  isSearching = false;
  error: string | null = null;

  constructor(
    private astronomyService: AstronomyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check for search query from route params
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
        this.performSearch();
      } else {
        this.loadGallery();
      }
    });
  }

  loadGallery(): void {
    this.isLoading = true;
    this.error = null;

    this.astronomyService.getMockHistoricalData().subscribe({
      next: (data) => {
        this.galleryItems = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load gallery. Please try again.';
        this.isLoading = false;
        console.error('Error loading gallery:', err);
      }
    });
  }

  performSearch(): void {
    if (!this.searchQuery.trim()) {
      this.loadGallery();
      return;
    }

    this.isSearching = true;
    this.error = null;

    const searchRequest = {
      query: this.searchQuery.trim(),
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined
    };

    // For now, filter the mock data
    this.astronomyService.getMockHistoricalData().subscribe({
      next: (data) => {
        this.galleryItems = data.filter(item =>
          item.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(this.searchQuery.toLowerCase()))
        );
        this.isSearching = false;
      },
      error: (err) => {
        this.error = 'Search failed. Please try again.';
        this.isSearching = false;
        console.error('Error searching:', err);
      }
    });
  }

  applyDateFilter(): void {
    if (!this.startDate && !this.endDate) {
      this.loadGallery();
      return;
    }

    this.isSearching = true;
    this.error = null;

    this.astronomyService.getMockHistoricalData().subscribe({
      next: (data) => {
        this.galleryItems = data.filter(item => {
          const itemDate = new Date(item.date);
          const start = this.startDate ? new Date(this.startDate) : null;
          const end = this.endDate ? new Date(this.endDate) : null;

          if (start && end) {
            return itemDate >= start && itemDate <= end;
          } else if (start) {
            return itemDate >= start;
          } else if (end) {
            return itemDate <= end;
          }
          return true;
        });
        this.isSearching = false;
      },
      error: (err) => {
        this.error = 'Filter failed. Please try again.';
        this.isSearching = false;
        console.error('Error filtering:', err);
      }
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.startDate = '';
    this.endDate = '';
    this.loadGallery();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.startDate || this.endDate);
  }

  openModal(item: HistoricalData): void {
    this.selectedItem = item;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedItem = null;
    document.body.style.overflow = 'auto';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  downloadImage(): void {
    if (this.selectedItem?.imageUrl) {
      const link = document.createElement('a');
      link.href = this.selectedItem.imageUrl;
      link.download = `${this.selectedItem.title.replace(/\s+/g, '_')}.jpg`;
      link.click();
    }
  }

  shareItem(): void {
    if (this.selectedItem && navigator.share) {
      navigator.share({
        title: this.selectedItem.title,
        text: this.selectedItem.description,
        url: window.location.href
      });
    } else if (this.selectedItem) {
      // Fallback: copy to clipboard
      const shareText = `${this.selectedItem.title} - ${window.location.href}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  }

  retry(): void {
    if (this.hasActiveFilters()) {
      this.performSearch();
    } else {
      this.loadGallery();
    }
  }
}
