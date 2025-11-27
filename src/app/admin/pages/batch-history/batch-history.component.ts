import { Component, OnInit } from '@angular/core';
import { BatchHistoryService } from '../../services/batch-history.service';
import { BatchHistoryGridComponent } from '../batch-history-grid/batch-history-grid.component';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, finalize } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { DynamicPopupComponent } from '../../../shared/components/popup/dynamic-popup.component';
import { GridTextPopupComponent } from '../../../shared/components/grid-text-popup/grid-text-popup.component';

@Component({
  selector: 'app-batch-history',
  templateUrl: './batch-history.component.html',
  styleUrls: ['./batch-history.component.css'],
  standalone: true,
  imports: [
    BatchHistoryGridComponent,
    FormsModule,
    AsyncPipe,
    CommonModule,
    NgSelectModule,
    DynamicPopupComponent,
    GridTextPopupComponent,
  ],
})
export class BatchHistoryComponent implements OnInit {
  jobNames: string[] = [];
  selectedJob: string = 'all';

  totalRowCount$ = new BehaviorSubject<number>(0);

  rows$ = new BehaviorSubject<any[]>([]);
  rows: any[] = [];
  loading = false;

  totalCount = 0;
  popupMessage: string = '';
  popupTitle: string = '';
  showTextPopup: boolean = false;

  gridContext = { componentParent: this };
  constructor(private batchHistoryService: BatchHistoryService) {}

  ngOnInit(): void {
    this.loadJobNames();
    this.getList();
  }

  loadJobNames() {
    this.jobNames = [];
    this.batchHistoryService.getJobNames().subscribe((res) => {
      this.jobNames = ['all', ...res];
      this.selectedJob = 'all';
    });
  }

  onJobChange() {
    this.getList();
  }

  getList() {
    if (this.loading) return;
    this.loading = true;

    this.totalCount = 0;
    this.rows = [];
    this.totalRowCount$.next(0);
    this.rows$.next(this.rows);

    this.batchHistoryService
      .getExecutionHistories(this.selectedJob)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.rows = res;
          this.rows$.next(res);
          this.totalRowCount$.next(res.length);
        },
        error: (err) => {
          console.error('이력 조회 실패:', err);
          alert(err?.error?.message || '서버 오류가 발생했습니다.');
        },
      });
  }

  comma(n: any) {
    const v = Number(n);
    return Number.isFinite(v) ? v.toLocaleString('ko-KR') : '0';
  }

  showErrorPopup(message: string) {
    this.popupTitle = '에러메세지';
    this.popupMessage = message;
    this.showTextPopup = true;
  }
  handlePopupClose() {
    this.showTextPopup = false;
  }
}
