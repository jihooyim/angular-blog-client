import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTextPopupComponent } from './grid-text-popup.component';

describe('GridTextPopupComponent', () => {
  let component: GridTextPopupComponent;
  let fixture: ComponentFixture<GridTextPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridTextPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridTextPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
