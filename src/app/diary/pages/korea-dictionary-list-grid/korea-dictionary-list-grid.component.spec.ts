import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoreaDictionaryListGridComponent } from './korea-dictionary-list-grid.component';

describe('KoreaDictionaryListGridComponent', () => {
  let component: KoreaDictionaryListGridComponent;
  let fixture: ComponentFixture<KoreaDictionaryListGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KoreaDictionaryListGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KoreaDictionaryListGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
