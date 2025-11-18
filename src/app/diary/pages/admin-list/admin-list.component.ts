import { Component, OnInit } from '@angular/core';
import { AdminListGridComponent } from '../admin-list-grid/admin-list-grid.component';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { BehaviorSubject, finalize, map } from 'rxjs';
import { OverlayService } from '../../../shared/services/overlay.service';
import { AsyncPipe } from '@angular/common';
import { BlogsRequestDto } from '../../models/diary.model';
import { FormsModule } from '@angular/forms';
import { NgZone } from '@angular/core';
import { CustomPopupService } from '../../../shared/services/popup.service';
import { ImportPopupComponent } from '../import-popup/import-popup.component';

@Component({
  selector: 'app-admin-list.component',
  imports: [AdminListGridComponent, AsyncPipe, FormsModule],
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css',
  standalone: true,
})
export class AdminListComponent implements OnInit {
  rows$ = new BehaviorSubject<any[]>([]);
  rows: any[] = [];
  loading = false;
  totalRowCount$ = this.rows$.pipe(map((list: any[]) => list.length));
  gridContext = { componentParent: this };

  startDate?: string;
  endDate?: string;
  searchText?: string;

  constructor(
    private router: Router,
    private blogService: BlogService,
    public overlay: OverlayService,
    private zone: NgZone,
    private customPopupService: CustomPopupService
  ) {}

  ngOnInit(): void {
    this.startDate = '';
    this.endDate = '';
    this.searchText = '';
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
    if (this.loading) return;

    this.loading = true;
    this.zone.run(() => {
      this.overlay.show({ hint: '목록 조회중...' });
    });

    const params: BlogsRequestDto = {
      startDate: this.startDate,
      endDate: this.endDate,
      searchText: this.searchText?.trim(),
    };

    this.blogService
      .getBlogs(params)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.overlay.hide();
        })
      )
      .subscribe({
        next: (res) => {
          this.rows$.next(res);
          this.rows = res;
        },
        error: (err) => {
          console.error('API 호출 실패:', err);
          alert(err?.error?.message || '서버 오류가 발생했습니다.');
        },
      });
  }

  goToWritePage() {
    this.router.navigate(['/detail'], {
      state: { blogId: undefined },
    });
  }

  comma(n: any) {
    const v = Number(n);
    return Number.isFinite(v) ? v.toLocaleString('ko-KR') : '0';
  }

  openImportPopup() {
    this.customPopupService
      .open(ImportPopupComponent, {
        width: 430,
        height: 200,
        title: 'Blogger Import',
        inputs: {},
      })
      .subscribe((res) => {
        if (res?.status === 'success') {
          this.loading = false;
          this.refresh();
        }
      });
  }

  goToBlogView(event?: MouseEvent) {
    event?.preventDefault();
    this.router.navigate(['myblog']);
  }
}
