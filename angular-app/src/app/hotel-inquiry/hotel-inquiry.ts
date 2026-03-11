import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

interface InquiryPayload {
  title: string;
  body: string;
  userId: number;
}

function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selected = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected >= today ? null : { pastDate: true };
}

const ROOM_PRICES: Record<string, number> = {
  standard: 120,
  deluxe: 200,
  suite: 350,
};

@Component({
  selector: 'app-hotel-inquiry',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hotel-inquiry.html',
  styleUrl: './hotel-inquiry.css',
})
export class HotelInquiry implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  minDate = new Date().toISOString().split('T')[0];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-]{7,15}$/)]],
    roomType: ['', Validators.required],
    checkIn: ['', [Validators.required, futureDateValidator]],
    nights: [1, [Validators.required, Validators.min(1), Validators.max(30)]],
    specialRequests: [''],
  });

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  get estimatedTotal(): number {
    const room = this.form.value.roomType ?? '';
    const nights = this.form.value.nights ?? 0;
    const price = ROOM_PRICES[room] ?? 0;
    return price * (nights || 0);
  }

  get selectedRoomPrice(): number {
    return ROOM_PRICES[this.form.value.roomType ?? ''] ?? 0;
  }

  ngOnInit(): void {
    // Recalculate price preview whenever room type or nights change
    this.form.get('roomType')?.valueChanges.subscribe(() => {});
    this.form.get('nights')?.valueChanges.subscribe(() => {});
  }

  fieldError(field: string, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.touched && ctrl.hasError(error));
  }

  fieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const v = this.form.value;
    const payload: InquiryPayload = {
      title: `Hotel Inquiry – ${v.roomType} room by ${v.name}`,
      body: JSON.stringify({
        email: v.email,
        phone: v.phone,
        roomType: v.roomType,
        checkIn: v.checkIn,
        nights: v.nights,
        estimatedTotal: this.estimatedTotal,
        specialRequests: v.specialRequests,
      }),
      userId: 1,
    };

    this.http
      .post<InquiryPayload & { id: number }>(
        'https://jsonplaceholder.typicode.com/posts',
        payload
      )
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.form.reset({ nights: 1 });
        },
        error: () => {
          this.isSubmitting = false;
          this.submitError = 'Submission failed. Please try again.';
        },
      });
  }

  resetForm(): void {
    this.submitSuccess = false;
    this.form.reset({ nights: 1 });
  }
}
