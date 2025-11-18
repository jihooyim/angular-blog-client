import { Component, Input, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Router } from '@angular/router';
import { BlogView } from '../../models/diary.model';
import { ActivatedRoute } from '@angular/router';
import { OverlayService } from '../../../shared/services/overlay.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detail-publish',
  imports: [],
  templateUrl: './detail-publish.component.html',
  styleUrl: './detail-publish.component.css',
})
export class DetailPublishComponent implements OnInit {
  blogId?: number;
  blog?: BlogView;
  backgroundImageUrl: string = '';
  loading = false;

  @Input() title?: string = '';
  @Input() htmlContent?: string = '';
  @Input() formatUpdateDate?: string = '';
  @Input() formatPublishedDate?: string = '';
  @Input() tags?: string = '';

  constructor(
    private blogService: BlogService,
    private router: ActivatedRoute,
    public overlay: OverlayService
  ) {
    try {
      const id = this.router.snapshot.paramMap.get('id');
      if (id) {
        this.blogId = parseInt(id);
      }
    } catch (err) {}
  }

  ngOnInit(): void {
    const randomIndex = Math.floor(Math.random() * 10); // 0 ~ 9
    this.backgroundImageUrl = `assets/images/${randomIndex}.jpg`;

    if (this.blogId) {
      this.loading = true;
      this.overlay.show({ hint: '조회중...' });

      this.blogService
        .getBlogView(this.blogId)
        .pipe(
          finalize(() => {
            this.loading = false;
            this.overlay.hide();
          })
        )
        .subscribe((res: BlogView) => {
          this.blog = res;
        });
    }

    if (!this.blogId) {
      this.blog = {
        title: this.title,
        htmlContent: this.htmlContent,
        formatPublishedDate: this.formatPublishedDate,
        formatUpdateDate: this.formatUpdateDate,
      };
    }
  }

  get formattedTime(): string {
    const raw = this.blog?.formatPublishedDate ?? '';
    const timePart = raw.split(' ')[1]; // '16:47:49'
    if (!timePart) return '';

    const [hour, minute] = timePart.split(':');
    return `${hour}:${minute}`; // => '16:47'
  }
}
