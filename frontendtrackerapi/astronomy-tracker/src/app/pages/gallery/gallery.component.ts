import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AstronomyService } from '../../services/astronomy.service';
import { HistoricalData, ApodCalendarItem } from '../../models/astronomy';

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

  // Current month context for APOD calendar
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1; // 1-12

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

    // Load APOD monthly calendar items via backend proxy
    this.astronomyService.getApodCalendarMonth(this.currentYear, this.currentMonth).subscribe({
      next: (items: ApodCalendarItem[]) => {
        // Map to HistoricalData shape used by UI
        this.galleryItems = items.map((i) => ({
          id: i.pageUrl,
          date: new Date(i.date).toISOString(),
          title: i.title || `APOD ${new Date(i.date).toDateString()}`,
          description: 'Astronomy Picture of the Day',
          imageUrl: i.imageUrl,
          tags: ['apod', new Date(i.date).toLocaleString('en-US', { month: 'long' }).toLowerCase(), `${new Date(i.date).getFullYear()}`]
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading APOD calendar:', err);
        // Fallback to existing mock data if backend is down
        this.astronomyService.getMockHistoricalData().subscribe({
          next: (data) => {
            this.galleryItems = data;
            this.isLoading = false;
          },
          error: () => {
            this.error = 'Failed to load gallery. Please try again.';
            this.isLoading = false;
          }
        });
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

    // Filter the currently loaded month items client-side
    const q = this.searchQuery.toLowerCase();
    const filtered = this.galleryItems.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.tags || []).some(tag => tag.toLowerCase().includes(q))
    );
    // Simulate async UX consistency
    setTimeout(() => {
      this.galleryItems = filtered;
      this.isSearching = false;
    }, 100);
    /* this.astronomyService.getMockHistoricalData().subscribe({
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
    }); */
  }

  applyDateFilter(): void {
    // If user selected a specific month (same YYYY-MM), fetch that APOD month from backend
    if (this.startDate || this.endDate) {
      const src = this.startDate || this.endDate!;
      const d = new Date(src);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;

      // If both provided and same month/year OR only one date: fetch that month
      const sameMonth = this.startDate && this.endDate
        ? (new Date(this.startDate).getFullYear() === new Date(this.endDate).getFullYear() &&
           new Date(this.startDate).getMonth() === new Date(this.endDate).getMonth())
        : true;

      if (sameMonth) {
        this.isSearching = true;
        this.error = null;
        this.currentYear = y;
        this.currentMonth = m;

        this.astronomyService.getApodCalendarMonth(y, m).subscribe({
          next: (items) => {
            this.galleryItems = items.map((i) => ({
              id: i.pageUrl,
              date: new Date(i.date).toISOString(),
              title: i.title || `APOD ${new Date(i.date).toDateString()}`,
              description: 'Astronomy Picture of the Day',
              imageUrl: i.imageUrl,
              tags: ['apod', new Date(i.date).toLocaleString('en-US', { month: 'long' }).toLowerCase(), `${new Date(i.date).getFullYear()}`]
            }));

            // After fetch, if there is a full date range, filter by day within that month
            if (this.startDate && this.endDate) {
              const start = new Date(this.startDate);
              const end = new Date(this.endDate);
              this.galleryItems = this.galleryItems.filter(g => {
                const gd = new Date(g.date);
                return gd >= start && gd <= end;
              });
            }

            this.isSearching = false;
          },
          error: (err) => {
            console.error('Error fetching APOD month:', err);
            // Fallback: keep UX responsive using mock data
            this.astronomyService.getMockHistoricalData().subscribe({
              next: (data) => {
                this.galleryItems = data;
                this.isSearching = false;
                this.error = 'Backend unavailable, showing sample data.';
              },
              error: () => {
                this.error = 'Failed to load APOD month. Please try again.';
                this.isSearching = false;
              }
            });
          }
        });
        return;
      }
    }

    // Otherwise, just filter the currently loaded list by date range
    if (!this.startDate && !this.endDate) {
      this.loadGallery();
      return;
    }

    this.isSearching = true;
    this.error = null;

    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : null;
    const filtered = this.galleryItems.filter(item => {
      const itemDate = new Date(item.date);
      if (start && end) {
        return itemDate >= start && itemDate <= end;
      } else if (start) {
        return itemDate >= start;
      } else if (end) {
        return itemDate <= end;
      }
      return true;
    });
    this.galleryItems = filtered;
    this.isSearching = false;
  }

  // Load a specific APOD month and update gallery
  fetchMonth(year: number, month: number): void {
    if (!year || !month) return;
    this.isLoading = true;
    this.error = null;
    this.currentYear = year;
    this.currentMonth = month;

    this.astronomyService.getApodCalendarMonth(year, month).subscribe({
      next: (items) => {
        this.galleryItems = items.map((i) => ({
          id: i.pageUrl,
          date: new Date(i.date).toISOString(),
          title: i.title || `APOD ${new Date(i.date).toDateString()}`,
          description: 'Astronomy Picture of the Day',
          imageUrl: i.imageUrl,
          tags: ['apod', new Date(i.date).toLocaleString('en-US', { month: 'long' }).toLowerCase(), `${new Date(i.date).getFullYear()}`]
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching APOD month:', err);
        this.error = 'Failed to load APOD month. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // Navigate to previous month
  prevMonth(): void {
    let y = this.currentYear;
    let m = this.currentMonth - 1;
    if (m < 1) {
      m = 12;
      y = y - 1;
    }
    this.fetchMonth(y, m);
  }

  // Navigate to next month
  nextMonth(): void {
    let y = this.currentYear;
    let m = this.currentMonth + 1;
    if (m > 12) {
      m = 1;
      y = y + 1;
    }
    this.fetchMonth(y, m);
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
