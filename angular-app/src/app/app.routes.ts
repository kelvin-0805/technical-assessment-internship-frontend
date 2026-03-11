import { Routes } from '@angular/router';
import { Hotels } from './hotels/hotels';
import { HotelInquiry } from './hotel-inquiry/hotel-inquiry';

export const routes: Routes = [
  { path: '', redirectTo: 'hotels', pathMatch: 'full' },
  { path: 'hotels', component: Hotels },
  { path: 'inquiry', component: HotelInquiry },
];
