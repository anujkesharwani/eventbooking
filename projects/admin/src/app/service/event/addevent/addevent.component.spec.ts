import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeventComponent } from './addevent.component';

describe('AddeventComponent', () => {
  let component: AddeventComponent;
  let fixture: ComponentFixture<AddeventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddeventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
