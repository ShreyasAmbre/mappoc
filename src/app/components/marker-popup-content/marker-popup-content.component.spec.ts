import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerPopupContentComponent } from './marker-popup-content.component';

describe('MarkerPopupContentComponent', () => {
  let component: MarkerPopupContentComponent;
  let fixture: ComponentFixture<MarkerPopupContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkerPopupContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkerPopupContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
