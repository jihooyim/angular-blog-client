import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListGridComponent } from './admin-list-grid.component';

describe('AdminListGridComponent', () => {
  let component: AdminListGridComponent;
  let fixture: ComponentFixture<AdminListGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminListGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminListGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
