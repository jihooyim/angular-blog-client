import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type OverlayVariant = 'spinner' | 'bar';

export interface OverlayOptions {
  title?: string;
  hint?: string;
  variant?: OverlayVariant;
  color?: string; // 진행바 색
  textColor?: string; // 글자 색
  backdropColor?: string; // 배경 색
  autoHideAfter?: number;
  minDuration?: number;
}

export interface OverlayState extends OverlayOptions {
  open: boolean;
}

@Injectable({ providedIn: 'root' })
export class OverlayService {
  private state$ = new BehaviorSubject<OverlayState>({
    open: false,
    variant: 'spinner',
  });

  private lightDefaults: OverlayOptions = {
    title: '',
    hint: '잠시만 기다려 주세요',
    color: '#2563eb', // 진행바 파랑
    textColor: '#111827', // 거의 검정 (gray-900)
    backdropColor: 'rgba(255,255,255,0.7)',
    variant: 'spinner',
  };

  private darkDefaults: OverlayOptions = {
    title: '',
    hint: '잠시만 기다려 주세요',
    color: '#16a34a', // 진행바 녹색
    textColor: '#ffffff', // 흰색 글자
    backdropColor: 'rgba(0,0,0,0.55)', // 반투명 블랙
    variant: 'spinner',
  };

  private mode: 'light' | 'dark' = 'dark';

  constructor() {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    this.mode = mq.matches ? 'dark' : 'light';

    mq.addEventListener('change', (e) => {
      this.mode = e.matches ? 'dark' : 'light';
    });
  }

  private get defaults(): OverlayOptions {
    return this.mode === 'dark' ? this.darkDefaults : this.lightDefaults;
  }

  get overlayState$(): Observable<OverlayState> {
    return this.state$.asObservable();
  }

  get isOpen(): boolean {
    return this.state$.value.open;
  }

  show(opts: OverlayOptions = {}) {
    const merged = { ...this.defaults, ...opts };
    const next: OverlayState = {
      ...merged,
      open: true,
    };
    this.state$.next(next);
  }

  hide() {
    this.state$.next({ ...this.state$.value, open: false });
  }

  setMode(mode: 'light' | 'dark') {
    this.mode = mode;
  }
}
