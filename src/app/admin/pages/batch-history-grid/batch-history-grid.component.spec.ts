import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchHistoryGridComponent } from './batch-history-grid.component';

describe('BatchHistoryGridComponent', () => {
  let component: BatchHistoryGridComponent;
  let fixture: ComponentFixture<BatchHistoryGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchHistoryGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchHistoryGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
