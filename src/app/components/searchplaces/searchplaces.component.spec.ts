import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchplacesComponent } from './searchplaces.component';

describe('SearchplacesComponent', () => {
  let component: SearchplacesComponent;
  let fixture: ComponentFixture<SearchplacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchplacesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchplacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
