import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoreaDictionaryListComponent } from './korea-dictionary-list.component';

describe('KoreaDictionaryListComponent', () => {
  let component: KoreaDictionaryListComponent;
  let fixture: ComponentFixture<KoreaDictionaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KoreaDictionaryListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KoreaDictionaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
