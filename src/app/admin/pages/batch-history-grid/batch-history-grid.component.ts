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
import { HttpClient } from '@angular/common/http';

provideGlobalGridOptions({ theme: 'legacy' });

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CellStyleModule,
  RowSelectionModule,
]);

@Component({
  selector: 'app-batch-history-grid',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './batch-history-grid.component.html',
  styleUrl: './batch-history-grid.component.css',
})
export class BatchHistoryGridComponent {
  @Input() rowData: any[] = [];

  @Input() jobName: string = 'all';
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
    public overlay: OverlayService,
    private http: HttpClient
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

  ngOnChanges() {}

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
    { field: 'jobName', headerName: 'Job 이름', minWidth: 150 },
    { field: 'startTime', headerName: '시작 시간', width: 180 },
    { field: 'endTime', headerName: '종료 시간', width: 180 },
    {
      field: 'status',
      headerName: '상태',
      width: 100,
      cellStyle: { textAlign: 'center' },
    },
    {
      field: 'exitMessage',
      headerName: '에러 메시지',
      minWidth: 500,
      tooltipField: 'errorMessage',
      cellClass: 'ag-cell-with-tooltip',
      onCellClicked: (params) => {
        params.context?.componentParent?.showErrorPopup(params.value);
      },
    },
  ];

  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 200,
    enableBrowserTooltips: true,
    onPaginationChanged: () => {
      if (this.gridApi) {
        const page = this.gridApi.paginationGetCurrentPage();
        const size = this.gridApi.paginationGetPageSize();
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
    columnDefs: [],
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
