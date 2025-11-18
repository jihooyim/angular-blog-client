import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchHistoryComponent } from './batch-history.component';

describe('BatchHistoryComponent', () => {
  let component: BatchHistoryComponent;
  let fixture: ComponentFixture<BatchHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
