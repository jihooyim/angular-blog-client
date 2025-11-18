import { Component, Input } from '@angular/core';
import {
  CellClickedEvent,
  ColDef,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry } from 'ag-grid-community';
import {
  ClientSideRowModelModule,
  provideGlobalGridOptions,
  CellStyleModule,
  RowSelectionModule,
} from 'ag-grid-community';

import { ThemeService } from '../../../shared/services/theme.service';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { OverlayService } from '../../../shared/services/overlay.service';
import { finalize } from 'rxjs';

provideGlobalGridOptions({ theme: 'legacy' });

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CellStyleModule,
  RowSelectionModule,
]);

@Component({
  selector: 'app-admin-list-grid',
  imports: [CommonModule, AgGridModule],
  templateUrl: './admin-list-grid.component.html',
  styleUrl: './admin-list-grid.component.css',
})
export class AdminListGridComponent {
  @Input() rowData: any[] = [];
  @Input() myStyle: string = 'width: 100%; height: 75vh';
  @Input() context: any;

  loading = false;

  showPopup = (data: any) => {
    this.popupData = data;
  };

  popupData: any = null;
  myTheme: any;
  themeClass: string = '';
  gridApi: any;
  gridColumnApi: any;

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private blogService: BlogService,
    public overlay: OverlayService
  ) {}

  ngOnInit() {
    this.gridOptions.context = {
      componentParent: this,
    };

    const { theme, themeClass } = this.themeService.applyTheme();
    this.myTheme = theme;
    this.themeClass = themeClass;

    this.themeService.watchThemeChange(() => {
      const { theme, themeClass } = this.themeService.applyTheme();
      this.myTheme = theme;
      this.themeClass = themeClass;
    });
  }

  columnDefs: ColDef[] = [
    {
      headerName: '번호',
      valueGetter: (params) =>
        params.node?.rowIndex != null ? params.node.rowIndex + 1 : '',
      width: 80,
      menuTabs: [],
      cellClassRules: {
        'clickable-title': () => true, // 항상 적용
      },
      cellStyle: { textAlign: 'center' },
    },
    {
      field: 'title',
      headerName: '제목',
      minWidth: 450,
      maxWidth: 1200,
      editable: false,
      cellRenderer: (params: { value: string; data: { blogId: any } }) => {
        const span = document.createElement('span');
        span.innerText =
          !params.value || params.value === ''
            ? '(제목없음)'
            : getRandomTitle(params.value);
        span.style.cursor = 'pointer';
        span.addEventListener('click', () => {
          this.router.navigate(['/detail'], {
            state: { blogId: params.data.blogId },
          });
        });

        return span;
      },
    },
    {
      field: 'formatPublishedDate',
      headerName: '게시일',
      editable: false,
    },
    {
      field: 'formatUpdateDate',
      headerName: '수정일',
      editable: false,
    },
    {
      field: 'readCount',
      headerName: '조회수',
      width: 100,
      editable: false,
    },
    {
      field: 'actions',
      minWidth: 100,
      maxWidth: 100,
      headerName: 'Action',
      editable: false,
      cellRenderer: (params: any): HTMLElement => {
        const container = document.createElement('div');
        container.classList.add('d-flex', 'gap-2');

        // 보기 버튼 (아이콘 포함)
        const viewBtn = document.createElement('button');
        viewBtn.innerHTML = '<i class="bi bi-eye"></i>';
        viewBtn.classList.add('icon-btn', 'icon-yellow');
        viewBtn.title = '보기';
        viewBtn.style.cursor = 'pointer';

        viewBtn.addEventListener('click', () => {
          const blogId = params.data.blogId;
          if (blogId) {
            // this.router.navigate(['/detail-view'], {
            //   state: { blogId: blogId },
            // });

            window.open(
              this.router.serializeUrl(
                this.router.createUrlTree(['/detail-view', blogId])
              ),
              '_blank'
            );
          }
        });

        // 삭제 버튼 (휴지통 아이콘)
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
        deleteBtn.classList.add('icon-btn', 'icon-red');
        deleteBtn.title = '삭제';
        deleteBtn.style.cursor = 'pointer';

        deleteBtn.addEventListener('click', () => {
          if (this.loading) return;

          const blogId = params.data.blogId;
          const ok = confirm(`블로그를 삭제할까요?`);
          if (!ok) return;

          this.loading = true;
          this.overlay.show({ hint: '삭제중...' });

          this.blogService
            .deleteBlog(blogId)
            .pipe(
              finalize(() => {
                this.loading = false;
                this.overlay.hide();
              })
            )
            .subscribe({
              next: () => {
                params.context.componentParent.getList();
              },
              error: (err) => {
                console.error('블로그 삭제 실패:', err);
                alert('블로그 삭제 중 오류가 발생했습니다.');
              },
            });
        });

        container.appendChild(viewBtn);
        container.appendChild(deleteBtn);

        return container;
      },
    },
  ];

  gridOptions: GridOptions = {
    context: {},
    columnDefs: this.columnDefs,
    // domLayout: 'autoHeight',
    defaultColDef: { sortable: true, resizable: true },
  };

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
  };

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // setTimeout(() => {
    //   const allColumnIds = this.gridColumnApi
    //     .getAllColumns()
    //     .map((col: { getColId: () => any }) => col.getColId());
    //   this.gridColumnApi.autoSizeColumns(allColumnIds);
    // }, 100);
  }

  onGridSizeChanged(event: any) {
    // if (this.gridApi && this.gridColumnApi) {
    //   const allColumnIds = this.gridColumnApi
    //     .getAllColumns()
    //     .map((col: { getColId: () => any }) => col.getColId());
    //   this.gridColumnApi.autoSizeColumns(allColumnIds);
    // }
    // event.api.sizeColumnsToFit();
    // this.myStyle = 'width: 100%; height: 80vh';
  }
}
function getRandomTitle(input: string): string {
  let maskedString = input[0];
  for (let i = 1; i < input.length; i++) {
    maskedString += '#';
  }
  return maskedString;
}
