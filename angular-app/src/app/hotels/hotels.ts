import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface Hotel {
  id: number;
  name: string;
  description: string;
  stars: number;
  pricePerNight: number;
  location: string;
}

@Component({
  selector: 'app-hotels',
  imports: [CommonModule, RouterLink],
  templateUrl: './hotels.html',
  styleUrl: './hotels.css',
})
export class Hotels implements OnInit {
  private http = inject(HttpClient);

  hotels: Hotel[] = [];
  isLoading = true;
  errorMessage = '';

  private readonly LOCATIONS = [
    'Kuala Lumpur', 'Penang', 'Langkawi', 'Johor Bahru',
    'Kota Kinabalu', 'Malacca', 'Kuching', 'Ipoh', 'Genting Highlands',
  ];

  private readonly PRICES = [150, 220, 180, 300, 260, 190, 210, 170, 340];

  ngOnInit(): void {
    this.http
      .get<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=9')
      .subscribe({
        next: (posts) => {
          this.hotels = posts.map((post) => this.mapPostToHotel(post));
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load hotels. Please try again later.';
          this.isLoading = false;
        },
      });
  }

  private mapPostToHotel(post: Post): Hotel {
    const idx = (post.id - 1) % this.LOCATIONS.length;
    return {
      id: post.id,
      name: this.titleCase(post.title.split(' ').slice(0, 4).join(' ')),
      description: this.capitalize(post.body.replace(/\n/g, ' ')),
      stars: (post.userId % 4) + 2,
      pricePerNight: this.PRICES[idx],
      location: this.LOCATIONS[idx],
    };
  }

  private titleCase(str: string): string {
    return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getStarArray(stars: number): number[] {
    return Array.from({ length: stars }, (_, i) => i);
  }

  retry(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.ngOnInit();
  }
}
