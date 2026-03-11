import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelInquiry } from './hotel-inquiry';

describe('HotelInquiry', () => {
  let component: HotelInquiry;
  let fixture: ComponentFixture<HotelInquiry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelInquiry],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelInquiry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
