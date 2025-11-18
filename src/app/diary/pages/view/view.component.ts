import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  RendererStyleFlags2,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ViewListComponent } from '../view-list/view-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayService } from '../../../shared/services/overlay.service';
import { BlogService } from '../../services/blog.service';
import { finalize } from 'rxjs';
import { BlogMenu, BlogUserView, BlogView } from '../../models/diary.model';
import { NgIf } from '@angular/common';
import { NgStyle } from '@angular/common'; // NgStyle 임포트

@Component({
  selector: 'app-view',
  imports: [ViewListComponent, NgIf, NgStyle],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements OnInit, AfterViewInit {
  userId?: string;
  blogId?: number | undefined | null = null;
  loading: boolean = false;
  title?: string = '';
  @ViewChild('blogTitle') blogTitle!: ElementRef;

  htmlContent?: string = '';
  formatUpdateDate?: string = '';
  formatPublishedDate?: string = '';
  tagList?: string[] = [];
  list: BlogMenu[] = [];
  backgroundImageUrl: string = '';
  showToast = false;
  showMiniMenu = true;
  showNewWritePage = false;

  defaultColor = 'rgb(218, 217, 217)';
  defaultSize = 0.7;
  defaultFontWeight = '500';
  customFontColor: string = this.defaultColor;
  customFontSize: number = this.defaultSize;
  customFontWeight: string = this.defaultFontWeight;
  showColorPicker: boolean = false;
  isMenuSortUp = false;

  constructor(
    private router: ActivatedRoute,
    public overlay: OverlayService,
    private blogService: BlogService,
    private route: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    try {
      this.userId = this.router.snapshot.paramMap.get('id') ?? '';
    } catch (err) {}
  }

  ngOnInit(): void {
    this.setBodyStyle();

    const randomIndex = Math.floor(Math.random() * 10); // 0 ~ 9
    this.backgroundImageUrl = `assets/images/${randomIndex}.jpg`;

    this.getBlogInfo(false);
  }

  getBlogInfo(flag: boolean) {
    if (this.loading) return;

    this.showNewWritePage = false;
    this.loading = true;
    this.overlay.show({ hint: '조회중...' });

    this.blogService
      .getBlogByUserId(this.userId, flag)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.overlay.hide();
        })
      )
      .subscribe((res: BlogUserView) => {
        if (res.blogView) {
          this.blogId = res.blogView.blogId;
          this.title = res.blogView.title;
          this.htmlContent = res.blogView.htmlContent;
          this.formatUpdateDate = res.blogView.formatUpdateDate;
          this.formatPublishedDate = res.blogView.formatPublishedDate;
          this.tagList = res.blogView.tagList;
        }
        this.list = res.list ?? [];

        this.showNewWritePage = this.list.length > 0 ? false : true;

        this.setSecreteStyle();
      });
  }

  handleBlogSelect(blogId: number) {
    if (this.loading) return;

    this.blogId = blogId;
    this.loading = true;
    this.overlay.show({ hint: '조회중...' });
    this.blogService
      .getBlogView(blogId)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.overlay.hide();
        })
      )
      .subscribe((res: BlogView) => {
        if (res) {
          this.title = res.title;
          this.htmlContent = res.htmlContent;
          this.formatUpdateDate = res.formatUpdateDate;
          this.formatPublishedDate = res.formatPublishedDate;
          this.tagList = res.tagList;
          setTimeout(() => {
            this.blogTitle.nativeElement.focus();
          }, 0); // View 업데이트 이후 포커스
        }
      });
  }

  ngAfterViewInit(): void {
    this.setDefaultStyle(); // DOM이 다 그려진 이후 호출됨
  }

  goToEdit(): void {
    if (this.blogId) {
      this.route.navigate(['/detail'], {
        state: { blogId: this.blogId },
      });
    }
  }

  goToNewPage() {
    this.route.navigate(['/detail'], {
      state: { blogId: null },
    });
  }
  get formattedTime(): string {
    const raw = this.formatPublishedDate ?? '';
    const timePart = raw.split(' ')[1];
    if (!timePart) return '';

    const [hour, minute] = timePart.split(':');
    return `${hour}:${minute}`;
  }

  get isLoggedIn(): boolean {
    return true;
  }

  goToManage() {
    this.route.navigate(['/admin-list'], {});
  }

  // 색상 선택기 토글
  toggleColorPicker() {
    this.showColorPicker = this.showColorPicker == true ? false : true;
  }

  setBodyStyle() {
    const body = this.el.nativeElement.ownerDocument.body;

    this.renderer.setStyle(
      body,
      'font-size',
      `${this.customFontSize}rem`,
      RendererStyleFlags2.Important
    );

    this.renderer.setStyle(
      body,
      'color',
      this.customFontColor,
      RendererStyleFlags2.Important
    );

    this.renderer.setStyle(
      body,
      'font-weight',
      this.customFontWeight, // 예: 'bold' 또는 '400', '700' 등
      RendererStyleFlags2.Important
    );
  }

  fontSizePlus() {
    this.customFontSize += 0.1;
    this.setBodyStyle();
  }

  fontSizeMinus() {
    this.customFontSize -= 0.1;
    this.setBodyStyle();
  }

  changeColor(event: any) {
    this.customFontColor = event.target.value;
    this.setBodyStyle();
  }

  setDefaultStyle() {
    this.customFontColor = this.defaultColor;
    this.customFontSize = this.defaultSize;
    this.showColorPicker = false;
    this.setBodyStyle();
  }

  setComportStyle() {
    this.customFontSize = 1;
    this.customFontColor = '#fff';
    this.customFontWeight = '700';

    this.setBodyStyle();
  }

  setSecreteStyle() {
    this.customFontSize = 0.6;
    this.customFontColor = '#a5a4a4';
    this.customFontWeight = '400';
    this.setBodyStyle();
  }

  copyBlog() {
    const title = this.title ?? '';
    const date = this.formatPublishedDate ?? '';
    const html = this.htmlContent ?? '';

    const div = document.createElement('div');
    div.innerHTML = html;

    // HTML → Text 변환
    div.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
    div.querySelectorAll('p, div').forEach((el) => {
      if (!el.textContent?.endsWith('\n')) {
        el.innerHTML += '\n';
      }
    });

    const plainText = div.textContent?.replace(/\n{2,}/g, '\n').trim() ?? '';
    const finalText = `${title}\n${date}\n${plainText}`;

    navigator.clipboard
      .writeText(finalText)
      .then(() => {
        //  애니메이션 재시작을 위해 "다시 렌더" 트리거
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 2000);
      })
      .catch((err) => {
        console.error('복사 실패:', err);
      });
  }

  hideMenu() {
    this.showMiniMenu = false;
  }
  showMenu() {
    this.showMiniMenu = true;
  }

  changeSortType(value: boolean) {
    this.isMenuSortUp = value;
    this.getBlogInfo(value);
  }
  goToDictionary() {
    this.route.navigate(['/dictionary-list'], {});
  }
}
