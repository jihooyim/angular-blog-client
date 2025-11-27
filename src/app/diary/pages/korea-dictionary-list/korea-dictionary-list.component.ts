import { Component } from '@angular/core';
import { KoreaDictionaryListGridComponent } from '../korea-dictionary-list-grid/korea-dictionary-list-grid.component';
import { BehaviorSubject, finalize, map } from 'rxjs';
import { Router } from '@angular/router';
import { OverlayService } from '../../../shared/services/overlay.service';
import { KoreaDictionaryService } from '../../services/korea-dictionary.service';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridTextPopupComponent } from '../../../shared/components/grid-text-popup/grid-text-popup.component';

@Component({
  selector: 'app-korea-dictionary-list.component',
  imports: [
    KoreaDictionaryListGridComponent,
    AsyncPipe,
    FormsModule,
    GridTextPopupComponent,
  ],
  templateUrl: './korea-dictionary-list.component.html',
  styleUrl: './korea-dictionary-list.component.css',
})
export class KoreaDictionaryListComponent {
  rows$ = new BehaviorSubject<any[]>([]);
  rows: any[] = [];
  loading = false;
  totalRowCount$ = new BehaviorSubject<number>(0);
  gridContext = { componentParent: this };

  startDate?: string;
  endDate?: string;
  searchText?: string;

  currentPage = 0;
  pageSize = 20;
  totalCount = 0;
  popupMessage: string = '';
  popupTitle: string = '';
  showTextPopup: boolean = false;

  get totalPages(): number {
    const total = Number(this.totalCount);
    const size = Number(this.pageSize);
    return size > 0 ? Math.ceil(total / size) : 1;
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getList();
    }
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.totalCount) {
      this.currentPage++;
      this.getList();
    }
  }

  constructor(
    private router: Router,
    private koreaDictionaryService: KoreaDictionaryService,
    public overlay: OverlayService
  ) {}

  ngOnInit(): void {
    this.startDate = '';
    this.endDate = '';
    this.searchText = '';

    this.currentPage = 0;
    this.pageSize = 20;

    this.getList();
  }

  search() {
    this.getList();
  }

  refresh() {
    this.startDate = '';
    this.endDate = '';
    this.searchText = '';
    this.getList();
  }

  onStartDateChange(value: string) {
    this.startDate = value;
    if (this.endDate) this.getList();
  }

  onEndDateChange(value: string) {
    this.endDate = value;
    if (this.startDate) this.getList();
  }

  getList(): void {
    console.log(this.loading, this.currentPage, this.pageSize);
    if (this.loading) return;
    if (this.currentPage === undefined || this.pageSize === undefined) return;

    this.loading = true;
    this.overlay.show({ hint: '목록 조회중...' });

    this.totalCount = 0;
    this.rows = [];
    this.totalRowCount$.next(0);
    this.rows$.next(this.rows);

    const params: any = {
      startDate: this.startDate,
      endDate: this.endDate,
      searchText: this.searchText?.trim(),
      page: this.currentPage,
      size: this.pageSize,
    };

    this.koreaDictionaryService
      .getDictionaryList(params)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.overlay.hide();
        })
      )
      .subscribe({
        next: (res) => {
          this.totalCount = res.totalElements;
          this.totalRowCount$.next(res.totalElements);
          this.rows = res.content;
          this.rows$.next(this.rows);
        },
        error: (err) => {
          console.error('API 호출 실패:', err);
          alert(err?.error?.message || '서버 오류가 발생했습니다.');
        },
      });
  }

  comma(n: any) {
    const v = Number(n);
    return Number.isFinite(v) ? v.toLocaleString('ko-KR') : '0';
  }

  showPopup(params: any) {
    this.popupTitle = params.word;
    this.popupMessage = params.definitionOriginal;
    this.showTextPopup = true;
  }
  handlePopupClose() {
    this.showTextPopup = false;
  }
}
