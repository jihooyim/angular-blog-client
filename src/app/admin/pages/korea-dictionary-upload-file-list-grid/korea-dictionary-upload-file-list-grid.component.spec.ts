import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoreaDictionaryUploadFileListGridComponent } from './korea-dictionary-upload-file-list-grid.component';

describe('KoreaDictionaryUploadFileListGridComponent', () => {
  let component: KoreaDictionaryUploadFileListGridComponent;
  let fixture: ComponentFixture<KoreaDictionaryUploadFileListGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KoreaDictionaryUploadFileListGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KoreaDictionaryUploadFileListGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
