import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPublishComponent } from './detail-publish.component';

describe('DetailPublishComponent', () => {
  let component: DetailPublishComponent;
  let fixture: ComponentFixture<DetailPublishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPublishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
