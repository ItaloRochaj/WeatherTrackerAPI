import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelestialEventsComponent } from './celestial-events.component';

describe('CelestialEventsComponent', () => {
  let component: CelestialEventsComponent;
  let fixture: ComponentFixture<CelestialEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CelestialEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CelestialEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
