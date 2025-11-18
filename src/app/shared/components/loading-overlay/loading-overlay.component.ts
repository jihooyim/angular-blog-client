import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OverlayService,
  OverlayState,
  OverlayVariant,
} from '../../services/overlay.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open()) {
    <div
      class="loading-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="로딩 중"
      (wheel.capture)="$event.preventDefault()"
      (touchmove.capture)="$event.preventDefault()"
      [style.background]="backdropCss()"
    >
      <div
        class="loading-dialog"
        role="status"
        aria-live="polite"
        [style.--overlay-fg]="color"
        [style.color]="textColor"
        [style.background]="backdropColor"
      >
        @if (variantSig() === 'spinner') {
        <div class="spinner"></div>
        } @else {
        <div class="bar"><span class="bar-fill"></span></div>
        }
        <div class="loading-title">{{ titleSig() }}</div>
        <div class="loading-hint">{{ hintSig() }}</div>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .loading-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        backdrop-filter: blur(6px);
      }
      .loading-dialog {
        width: min(92vw, 420px);
        border-radius: 20px;
        padding: 28px 24px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
        text-align: center;
      }
      .loading-title {
        font-weight: 700;
        font-size: 1.05rem;
        margin-top: 12px;
      }
      .loading-hint {
        opacity: 0.75;
        font-size: 0.9rem;
        margin-top: 10px;
      }
      .spinner {
        width: 44px;
        height: 44px;
        margin: 0 auto;
        border-radius: 50%;
        border: 4px solid rgba(0, 0, 0, 0.08);
        border-top-color: var(--overlay-fg, rgba(0, 0, 0, 0.55));
        animation: spin 0.9s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .bar {
        height: 8px;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.1);
        overflow: hidden;
        margin: 8px auto 0;
        width: 120px;
      }
      .bar-fill {
        display: block;
        width: 40%;
        height: 100%;
        background: currentColor;
        animation: barMove 1.1s ease-in-out infinite;
      }
      @keyframes barMove {
        0% {
          transform: translateX(-100%);
        }
        50% {
          transform: translateX(20%);
        }
        100% {
          transform: translateX(200%);
        }
      }
      .progress {
        position: relative;
        height: 6px;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.08);
        overflow: hidden;
        margin-top: 14px;
      }
      .progress-fill {
        position: absolute;
        inset: 0;
        transform: translateX(-100%);
        animation: indeterminate 1.2s ease-in-out infinite;
      }
      @keyframes indeterminate {
        0% {
          transform: translateX(-100%);
        }
        50% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(100%);
        }
      }
      :host-context(body.no-scroll) {
        overflow: hidden;
      }
    `,
  ],
})
export class LoadingOverlayComponent implements OnInit, OnDestroy {
  /** @Input 기본값 (서비스 옵션이 없을 때 사용) */
  @Input() title = '불러오는 중…';
  @Input() hint = '잠시만 기다려 주세요';
  @Input() color: string = '#2b6cb0'; // 전경색
  @Input() backdropOpacity = 0.35; // 배경 어둡기(0~1)
  @Input() textColor: string = '#fff';
  @Input() backdropColor: string = '#000';

  open = signal(false);
  private sub?: Subscription;

  @Input() variant: OverlayVariant = 'spinner'; // 유지
  titleSig = signal(this.title);
  hintSig = signal(this.hint);
  variantSig = signal<OverlayVariant>(this.variant);

  ngOnInit(): void {
    this.sub = this.overlay.overlayState$.subscribe((s: OverlayState) => {
      this.open.set(s.open);
      this.titleSig.set(s.title ?? this.title);
      this.hintSig.set(s.hint ?? this.hint);
      this.variantSig.set(s.variant ?? this.variant);
      if (s.color) this.color = s.color;
      if (s.textColor) this.textColor = s.textColor;
      if (s.backdropColor) this.backdropColor = s.backdropColor;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  constructor(private overlay: OverlayService) {}

  // 접근성/차단
  @HostListener('document:keydown.capture', ['$event'])
  onKeydown(event: Event) {
    const e = event as KeyboardEvent;
    if (this.open()) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  backdropCss() {
    return `rgba(10,15,25,${this.backdropOpacity})`;
  }
  progressCss() {
    return `linear-gradient(90deg, ${this.color}22, ${this.color}, ${this.color}22)`;
  }
}
