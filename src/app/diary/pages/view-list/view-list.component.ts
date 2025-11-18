import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { BlogMenu } from '../../models/diary.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-list',
  imports: [CommonModule],
  templateUrl: './view-list.component.html',
  styleUrl: './view-list.component.css',
})
export class ViewListComponent implements OnChanges {
  @Input() list: BlogMenu[] = [];
  @Input() selectedBlogId?: number | undefined | null = null;
  @Input() isMenuSortUp: boolean = false;

  @Output() selectBlog = new EventEmitter<number>();

  private lastClickedMonthKey: string | null = null;

  groupedByYearMonth: { [year: string]: any } = {};
  expandedMonths: { [key: string]: boolean } = {};

  ngOnChanges(): void {
    this.groupByYearAndMonth();

    if (this.lastClickedMonthKey) {
      this.expandedMonths = {
        [this.lastClickedMonthKey]: true,
      };
    } else {
      // 자동으로 마지막 달만 펼침 (기본 동작)
      const years = this.getSortedKeys(this.groupedByYearMonth);
      const latestYear = years[0];
      const months = this.getSortedKeys(this.groupedByYearMonth[latestYear]);
      const latestMonth = months[0];

      this.expandedMonths = {
        [`${latestYear}-${latestMonth}`]: true,
      };
    }

    this.lastClickedMonthKey = null; // 클릭 후 초기화
  }

  private groupByYearAndMonth(): void {
    this.groupedByYearMonth = {};

    for (const item of this.list) {
      if (!item.formatPublishedDateForMenu || !item.title) continue;

      const parts = item.formatPublishedDateForMenu.split('.');
      const year = parts[0];
      const month = parts[1]?.padStart(2, '0') || '01';

      if (!this.groupedByYearMonth[year]) {
        this.groupedByYearMonth[year] = { posts: [], count: 0 }; // count 추가
      }
      if (!this.groupedByYearMonth[year][month]) {
        this.groupedByYearMonth[year][month] = { posts: [], count: 0 }; // 월별 글 개수
      }

      this.groupedByYearMonth[year].posts.push(item);
      this.groupedByYearMonth[year].count++; // 연도별 글 개수 증가

      this.groupedByYearMonth[year][month].posts.push(item);
      this.groupedByYearMonth[year][month].count++; // 월별 글 개수 증가
    }
  }

  onTitleClick(
    blogId?: number,
    year?: string,
    month?: string,
    event?: MouseEvent
  ): void {
    event?.preventDefault();

    if (blogId) {
      this.selectBlog.emit(blogId);
      if (year && month) {
        const key = `${year}-${month}`;
        this.lastClickedMonthKey = key;
      }
    }
  }

  getSortedKeys(obj: any): string[] {
    if (obj) {
      let sortedKeys = undefined;
      if (this.isMenuSortUp === true) {
        sortedKeys = Object.keys(obj)
          .filter((key) => !isNaN(+key)) // 숫자 변환이 가능한 키만 포함
          .sort((a, b) => +a - +b); // 오름차순 (작은 값 → 큰 값)
      } else {
        sortedKeys = Object.keys(obj)
          .filter((key) => !isNaN(+key)) // 숫자 변환이 가능한 키만 포함
          .sort((a, b) => +b - +a); // 내림차순 정렬
      }

      return sortedKeys;
    }
    return [];
  }

  toggleMonth(year: string, month: string): void {
    const key = `${year}-${month}`;
    this.expandedMonths[key] = !this.expandedMonths[key];
  }

  isMonthExpanded(year: string, month: string): boolean {
    return this.expandedMonths[`${year}-${month}`];
  }

  formatMonth(month: string) {
    let v = '';
    try {
      v = isNaN(Number(month)) ? '' : String(Number(month));
      if (v === 'NaN') return '';
    } catch (e) {
      return '';
    }
    return v;
  }
}
