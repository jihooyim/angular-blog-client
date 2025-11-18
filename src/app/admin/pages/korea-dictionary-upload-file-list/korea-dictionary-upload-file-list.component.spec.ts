import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoreaDictionaryUploadFileListComponent } from './korea-dictionary-upload-file-list.component';

describe('KoreaDictionaryUploadFileListComponent', () => {
  let component: KoreaDictionaryUploadFileListComponent;
  let fixture: ComponentFixture<KoreaDictionaryUploadFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KoreaDictionaryUploadFileListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KoreaDictionaryUploadFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
