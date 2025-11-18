import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Renderer2,
  ElementRef,
  RendererStyleFlags2,
  AfterViewInit,
} from '@angular/core';
import { Editor, NgxEditorMenuComponent, NgxEditorComponent } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../shared/services/theme.service';
import { CommonModule } from '@angular/common';
import {
  Blog,
  RefinedButtonName,
  RefinedButtonNames,
} from '../../models/diary.model';
import { Subject, Subscription, debounceTime, finalize } from 'rxjs';
import { BlogService } from '../../services/blog.service';
import { PurificationService } from '../../services/purification.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { CustomPopupService } from '../../../shared/services/popup.service';
import { DetailPublishComponent } from '../detail-publish/detail-publish.component';
import { OverlayService } from '../../../shared/services/overlay.service';
import { AngularSplitModule } from 'angular-split';
import { ToastMessageComponent } from '../../../shared/components/toast-message/toast-message.component';
import { SpellCheckService } from '../../services/spellCheck.service';
import { environment } from '../../../../environments/environment.production';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    NgxEditorMenuComponent,
    NgxEditorComponent,
    FormsModule,
    CommonModule,
    NgIf,
    AngularSplitModule,
    ToastMessageComponent,
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit, OnDestroy, AfterViewInit {
  editor!: Editor;
  refinedEditor!: Editor;
  title: string = '';
  htmlContent: string = '';
  isDarkMode = false;
  isError = false;
  isSaving = false;
  isSaved = false;
  isLoad = false;
  saveState: 'default' | 'saving' | 'done' = 'default';
  isSavingBtn = false;
  originalBlog: Blog | undefined;
  loading = false;
  isSideMenuCollapsed = false;
  refinedHtmlContent: string | null = null;
  refinedButtonName: RefinedButtonName = RefinedButtonNames.PURIFY;

  isLoadingSpellCheck = false; // 맞춤법체크 api 실행중여부
  spellCheckProgress = { current: 0, total: 0 };
  spellCheckCompleted = false;

  @ViewChild('toastRef') toastRef!: ToastMessageComponent;

  blog: Blog = {
    htmlContent: '',
    title: '',
    tags: '',
    publishYn: undefined,
    blogId: undefined,
  };
  private contentChanged = new Subject<string>();
  private subscription!: Subscription;
  corrections: SpellCheckResult[] = [];

  /* 전체 글씨크기, 색상 제어 */
  defaultColor = '#000';
  defaultSize = 0.7;
  defaultFontWeight = '400';
  customFontColor: string = this.defaultColor;
  customFontSize: number = this.defaultSize;
  customFontWeight: string = this.defaultFontWeight;
  showMiniMenu = true;

  constructor(
    private themeService: ThemeService,
    private blogService: BlogService,
    private purificationService: PurificationService,
    private spellCheckService: SpellCheckService,
    private router: Router,
    private customPopupService: CustomPopupService,
    public overlay: OverlayService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.blog.blogId = navigation?.extras.state?.['blogId'] ?? undefined;
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.refinedEditor = new Editor();
    this.isDarkMode = this.themeService.getBrowserTheme() === 'dark';
    this.defaultColor = this.isDarkMode == true ? '#fff' : '#000';
    this.themeService.watchThemeChange(() => {
      const { theme, themeClass } = this.themeService.applyTheme();
      this.isDarkMode = this.themeService.getBrowserTheme() === 'dark';
      this.defaultColor = this.isDarkMode == true ? '#fff' : '#000';
      this.setDefaultStyle();
    });

    this.blogService.checkSession().subscribe({
      next: (res: any) => {
        try {
          if (res.loginRequired !== false) {
            this.router.navigate(['/login']);
          }
        } catch (e) {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.router.navigate(['/login']);
      },
    });

    // 자동 저장 처리 (2초 지연)
    this.subscription = this.contentChanged
      .pipe(debounceTime(2000))
      .subscribe(() => {
        if (!this.isLoad) {
          this.autoSave();
        } else {
          this.isLoad = false;
        }
      });

    if (this.blog.blogId) {
      this.getBlog(this.blog.blogId);
    } else {
      this.htmlContent = this.blog.htmlContent ?? '';
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.setDefaultStyle(), 0); // 최초 적용
  }

  ngOnDestroy(): void {
    this.editor.destroy();
    this.refinedEditor.destroy();
    this.subscription?.unsubscribe();
  }
  onTitleChange(value: string) {
    this.title = value;
    this.blog.title = value;
    this.contentChanged.next(value);
  }

  onPublishChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.blog.publishYn = inputElement.checked ? '1' : '0';
  }

  onContentChange(value: string) {
    this.htmlContent = value;
    this.blog.htmlContent = value;
    this.contentChanged.next(value);
  }

  autoSave() {
    if (!this.blog.htmlContent || this.isLoad || !this.isBlogModified()) return;

    this.isSaving = true;
    this.isSaved = false;

    if (this.blog.blogId && this.corrections) {
      this.blog.spellCorrections =
        this.corrections.length > 0 ? JSON.stringify(this.corrections) : '';
    }

    this.blogService.autoSaveBlog(this.blog).subscribe({
      next: (blogId: number) => {
        this.blog.blogId = blogId;
        this.originalBlog = structuredClone(this.blog);

        this.isSaving = false;
        this.isSaved = true;

        setTimeout(() => (this.isSaved = false), 3000); // ✅ 3초 유지
      },
      error: (error) => {
        this.isSaving = false;
        this.isSaved = false;
        this.isError = true;

        setTimeout(() => (this.isError = false), 3000); // ✅ 3초 유지
      },
    });
  }

  getBlog(blogId: number) {
    if (this.loading) return;
    this.loading = true;
    this.overlay.show({ hint: '글 조회중...' });

    this.isLoad = true;
    this.blogService
      .getBlog(blogId)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.overlay.hide();
        })
      )
      .subscribe({
        next: (res: Blog) => {
          this.blog = res;
          this.originalBlog = structuredClone(res);
          this.htmlContent = res.htmlContent ?? '';
          this.title = res.title ?? '';
          this.corrections = res.spellCorrections
            ? JSON.parse(res.spellCorrections)
            : [];

          this.refinedButtonName = res.publishContentKr
            ? RefinedButtonNames.EDIT
            : RefinedButtonNames.PURIFY;
          this.isLoad = true;
          this.setSecreteStyle();
        },
        error: (error) => {
          this.toastRef.show(
            '조회 중 에러가 발생했습니다. 다시 시도해주세요.',
            'bg-danger'
          );
        },
      });
  }

  save() {
    if (this.saveState != 'default') return;

    if (this.refinedHtmlContent) {
      const ok = confirm(
        `정제된 글은 저장되지 않습니다. 그래도 저장할까요? (게시버튼을 클릭하여 따로 저장해야합니다.)`
      );
      if (!ok) return;
    }

    if (this.blog.blogId && this.corrections) {
      this.blog.spellCorrections =
        this.corrections.length > 0 ? JSON.stringify(this.corrections) : '';
    }

    this.saveState = 'saving';
    this.isSavingBtn = true;

    this.blogService.saveBlog(this.blog).subscribe({
      next: (blogId: number) => {
        this.blog.blogId = blogId;
        this.originalBlog = structuredClone(this.blog);

        this.saveState = 'done';
        setTimeout(() => {
          this.saveState = 'default';
          this.isSavingBtn = false;
          if (this.blog.blogId) this.getBlog(this.blog.blogId);
        }, 1200);
      },
      error: (error) => {
        this.saveState = 'default';
        this.isSavingBtn = false;
        alert('저장중 에러!');
      },
    });
  }

  isBlogModified(): boolean {
    return JSON.stringify(this.blog) !== JSON.stringify(this.originalBlog);
  }

  goToList() {
    this.router.navigate(['/admin-list'], {
      state: { blogId: undefined },
    });
  }

  goToView() {
    this.customPopupService
      .open(DetailPublishComponent, {
        width: 1200,
        height: 400,
        title: 'PreView',
        inputs: {
          title: this.title,
          htmlContent: this.htmlContent,
          formatUpdateDate: this.blog.formatUpdateDate,
          formatPublishedDate: this.blog.formatPublishedDate,
        },
      })
      .subscribe((result) => {});
  }

  goToBlogView(event?: MouseEvent) {
    event?.preventDefault();
    this.router.navigate(['myblog']);
  }

  purify() {
    if (this.loading) return;

    if (this.blog.publishContentKr) {
      this.refinedHtmlContent = this.blog.publishContentKr;
      if (this.refinedHtmlContent) this.isSideMenuCollapsed = true;

      return;
    }

    this.loading = true;
    this.overlay.show({ hint: '글 정제중...' });

    this.purificationService
      .purify(this.htmlContent)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.overlay.hide();
        })
      )
      .subscribe({
        next: (res: string) => {
          this.refinedHtmlContent = res; // 정제 결과 표시

          if (this.refinedHtmlContent) this.isSideMenuCollapsed = true;
        },
        error: (error) => {
          this.toastRef.show(
            '정제 중 에러가 발생했습니다. 다시 시도해주세요.',
            'bg-danger'
          );
        },
      });
  }

  toggleSideMenu() {
    this.isSideMenuCollapsed = this.isSideMenuCollapsed == true ? false : true;
  }

  cancelPurify() {
    const ok = confirm(`정제작업을 취소할까요?`);
    if (!ok) return;

    this.refinedHtmlContent = '';
  }

  savePurify() {
    if (this.loading) return;

    if (!this.refinedHtmlContent || !this.blog || !this.blog.blogId) {
      return;
    }

    this.loading = true;
    this.overlay.show({ hint: '글 게시중...' });

    this.purificationService
      .save(this.blog.blogId, this.refinedHtmlContent)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.overlay.hide();
        })
      )
      .subscribe({
        next: (res: boolean) => {
          if (res) {
            this.toastRef.show('글이 게시되었습니다', 'bg-success');
            this.refinedHtmlContent = '';
            this.isSideMenuCollapsed = false;

            if (this.blog.blogId) this.getBlog(this.blog.blogId);
          }
        },
        error: (error) => {
          this.toastRef.show('게시 중 오류가 발생했습니다', 'bg-danger');
        },
      });
  }

  checkSpell() {
    if (
      !this.blog.blogId ||
      this.isLoadingSpellCheck ||
      !this.htmlContent ||
      this.htmlContent.length < 50
    )
      return;

    const jobId = crypto.randomUUID();

    const isLocal = window.location.hostname === 'localhost';

    console.log('isLocal', isLocal, window.location.hostname);

    const streamUrl = isLocal
      ? `/api/jobs/spellcheck/${jobId}/stream`
      : `${environment.apiBase}/jobs/spellcheck/${jobId}/stream`;

    const source = new EventSource(streamUrl, {
      withCredentials: true,
    });
    console.log('streamUrl', streamUrl);

    this.isLoadingSpellCheck = true;
    this.spellCheckCompleted = false;
    this.spellCheckProgress = { current: 0, total: 0 };
    this.corrections = [];

    this.spellCheckService
      .checkWholeText(this.htmlContent, this.blog.blogId, jobId)
      .subscribe();

    source.addEventListener('correction', (event: MessageEvent) => {
      const result: SpellCheckResult = JSON.parse(event.data);
      this.corrections.push(result);
      this.spellCheckProgress.current++;
    });

    source.addEventListener('progress', (event: MessageEvent) => {
      const { current, total } = JSON.parse(event.data);
      this.spellCheckProgress = { current, total };
    });

    source.addEventListener('done', () => {
      source.close();
      this.isLoadingSpellCheck = false;
      this.spellCheckCompleted = true;
      setTimeout(() => {
        this.spellCheckCompleted = false;
      }, 3000);
    });

    source.addEventListener('error', (event: MessageEvent) => {
      const error: ErrorSignal = JSON.parse(event.data);
      this.toastRef.show(`오류: ${error.message}`, 'bg-danger');
      alert(`${error.message}`);
      source.close();
      this.isLoadingSpellCheck = false;
    });

    source.onerror = () => {
      this.toastRef.show('SSE 연결 오류', 'bg-danger');
      source.close();
      this.isLoadingSpellCheck = false;
    };
  }

  modifySentence(item: SpellCheckResult) {
    let index = this.htmlContent.indexOf(item.original);
    if (index >= 0) {
      this.htmlContent = this.htmlContent.replace(
        item.original,
        item.corrected
      );

      const idx = this.corrections.findIndex(
        (c) => c.original === item.original && c.corrected === item.corrected
      );
      if (idx !== -1) {
        this.corrections.splice(idx, 1);
      }
    } else {
      alert('오류 발생!!');
      return;
    }
  }

  onMouseLeaveCorrected(item: SpellCheckResult) {
    console.log('aaaa');
    this.htmlContent = removeAllHighlightSpans(this.htmlContent);
  }

  onHoverCorrected(item: SpellCheckResult) {
    const index = this.htmlContent.indexOf(item.original);
    const styled = getStyledSentence(item.original);
    console.log('Aaa', item, index);
    if (index >= 0) {
      this.htmlContent = this.htmlContent.replace(item.original, styled);
    }
  }

  formatExplanation(text: string) {
    return text;
    // return text.replace(/(\d+\)\s*)/g, '<br><b>$1</b>');
  }

  toggleHighlight(item: SpellCheckResult) {
    item.isHighlighted = !item.isHighlighted;

    if (item.isHighlighted) {
      this.onHoverCorrected(item); // 강조
    } else {
      this.onMouseLeaveCorrected(item); // 강조 제거
    }
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
      this.customFontWeight,
      RendererStyleFlags2.Important
    );

    const buttons = body.querySelectorAll(
      'button, input, .form-label, .form-text'
    );
    buttons.forEach((btn: HTMLElement) => {
      this.renderer.setStyle(
        btn,
        'font-size',
        `${this.customFontSize}rem`,
        RendererStyleFlags2.Important
      );
      this.renderer.setStyle(
        btn,
        'color',
        this.customFontColor,
        RendererStyleFlags2.Important
      );
      this.renderer.setStyle(
        btn,
        'font-weight',
        this.customFontWeight,
        RendererStyleFlags2.Important
      );
    });
  }

  setComportStyle() {
    this.customFontSize = 0.9;
    // this.customFontColor = '#fff';
    this.customFontWeight = '400';

    this.setBodyStyle();
  }

  setSecreteStyle() {
    this.customFontSize = 0.5;
    // this.customFontColor = '#a5a4a4';
    this.customFontWeight = '300';
    this.setBodyStyle();
  }

  setDefaultStyle() {
    this.customFontColor = this.defaultColor;
    this.customFontSize = this.defaultSize;
    this.customFontWeight = this.defaultFontWeight;
    this.setBodyStyle();
  }

  hideMenu() {
    this.showMiniMenu = false;
  }
  showMenu() {
    this.showMiniMenu = true;
  }
}

function getStyledSentence(original: string) {
  return `<span style="background-color: var(--hight-text-background-color);">${original}</span>`;
}

function removeAllHighlightSpans(html: string): string {
  let previous;
  do {
    previous = html;
    html = removeHighlightSpans(html);
  } while (html !== previous); // 더 이상 바뀌지 않을 때까지 반복
  return html;
}

function removeHighlightSpans(html: string): string {
  return html.replace(
    /<span\b[^>]*style=["'][^"']*background-color\s*:\s*var\(--[\w-]+\)\s*;?[^"']*["'][^>]*>(.*?)<\/span>/gi,
    '$1'
  );
}
