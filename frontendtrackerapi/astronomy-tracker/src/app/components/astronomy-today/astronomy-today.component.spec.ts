import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AstronomyTodayComponent } from './astronomy-today.component';

describe('AstronomyTodayComponent', () => {
  let component: AstronomyTodayComponent;
  let fixture: ComponentFixture<AstronomyTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AstronomyTodayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AstronomyTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
