import { Component, Input } from '@angular/core';
import { ColDef, GridOptions } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry } from 'ag-grid-community';
import {
  ClientSideRowModelModule,
  provideGlobalGridOptions,
  CellStyleModule,
  RowSelectionModule,
} from 'ag-grid-community';

import { ThemeService } from '../../../shared/services/theme.service';
import { OverlayService } from '../../../shared/services/overlay.service';

provideGlobalGridOptions({ theme: 'legacy' });

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CellStyleModule,
  RowSelectionModule,
]);

@Component({
  selector: 'app-korea-dictionary-upload-file-list-grid',
  imports: [AgGridModule],
  templateUrl: './korea-dictionary-upload-file-list-grid.component.html',
  styleUrl: './korea-dictionary-upload-file-list-grid.component.css',
})
export class KoreaDictionaryUploadFileListGridComponent {
  @Input() rowData: any[] = [];
  @Input() myStyle: string = 'width: 100%; height: 80vh';
  @Input() context: any;
  @Input() totalCount: number = 0;

  loading = false;

  showPopup = (data: any) => {
    this.popupData = data;
  };
  paginationInitialized = false;

  popupData: any = null;
  myTheme: any;
  themeClass: string = '';
  gridApi: any;
  gridColumnApi: any;

  constructor(
    private themeService: ThemeService,
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
      valueGetter: (params) => {
        const page = params.context?.componentParent?.currentPage ?? 0;
        const size = params.context?.componentParent?.pageSize ?? 20;
        return params.node?.rowIndex != null
          ? page * size + params.node.rowIndex + 1
          : '';
      },
      width: 80,
      menuTabs: [],
      cellClassRules: {
        'clickable-title': () => true,
      },
      cellStyle: { textAlign: 'center' },
    },

    {
      field: 'fileName',
      headerName: '파일명',
      minWidth: 130,
      editable: false,
    },
    {
      field: 'fileFullPath',
      headerName: '전체 경로',
      minWidth: 220,
      editable: false,
    },
    {
      field: 'itemCount',
      headerName: '아이템 개수',
      width: 140,
      editable: false,
      cellStyle: { textAlign: 'center' },
    },
    {
      field: 'status',
      headerName: '상태',
      width: 80,
      editable: false,
      cellStyle: { textAlign: 'center' },
    },
    {
      field: 'errorMessage',
      headerName: '에러 메시지',
      minWidth: 200,
      editable: false,
      tooltipField: 'errorMessage',
      cellClass: 'ag-cell-with-tooltip',
    },

    {
      field: 'formatCreateDate',
      headerName: '생성일',
      width: 160,
      editable: false,
    },
    {
      field: 'formatUpdateDate',
      headerName: '수정일',
      width: 160,
      editable: false,
    },
  ];

  gridOpaginationInitialized = false;

  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 200,
    enableBrowserTooltips: true,
    onPaginationChanged: () => {
      if (this.gridApi) {
        const page = this.gridApi.paginationGetCurrentPage();
        const size = this.gridApi.paginationGetPageSize();

        // 유효성 검사 추가
        const isValidPage = typeof page === 'number' && page >= 0;
        const isValidSize = typeof size === 'number' && size > 0;

        if (!isValidPage || !isValidSize) return;

        if (!this.paginationInitialized) {
          this.paginationInitialized = true;
          return;
        }

        if (this.context?.componentParent?.getList) {
          this.context.componentParent.currentPage = page;
          this.context.componentParent.pageSize = size;
          this.context.componentParent.getList();
        }
      }
    },
    context: {},
    columnDefs: this.columnDefs,
    defaultColDef: {
      sortable: true,
      resizable: true,
    },
    rowSelection: 'single',
    suppressRowClickSelection: false,
    animateRows: true,
  };

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
  };

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
}
