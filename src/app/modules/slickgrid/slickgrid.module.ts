import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  AngularSlickgridModule,
  Column,
  DelimiterType,
  EventNamingStyle,
  FileType,
  Filters,
  OperatorType,
  RowDetailView,
  TreeDataOption,
} from 'angular-slickgrid'
import { ExcelExportService } from '@slickgrid-universal/excel-export'
@NgModule({
  declarations: [],

  imports: [
    CommonModule,
    AngularSlickgridModule.forRoot({
      alwaysShowVerticalScroll: true,
      autoEdit: true,
      asyncEditorLoading: false,
      autoFitColumnsOnFirstLoad: true,
      autoResize: {
        applyResizeToContainer: true,
        calculateAvailableSizeBy: 'window',
        bottomPadding: 20,
        minHeight: 180,
        minWidth: 300,
        rightPadding: 0,
        container: '#demo-container',
      },

      autoCommitEdit: true,

      enableFiltering: true,
      enableGrouping: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: false,
      preHeaderPanelHeight: 50,
      gridWidth: '100%',
      cellHighlightCssClass: 'slick-cell-modified',
      checkboxSelector: {
        cssClass: 'slick-cell-checkboxsel',
      },
      columnPicker: {
        fadeSpeed: 0,
        hideForceFitButton: false,
        hideSyncResizeButton: true,
        headerColumnValueExtractor: pickerHeaderColumnValueExtractor,
      },
      cellMenu: {
        autoAdjustDrop: true,
        autoAlignSide: true,
        hideCloseButton: true,
        hideCommandSection: false,
        hideOptionSection: false,
      },
      contextMenu: {
        autoAdjustDrop: true,
        autoAlignSide: true,
        hideCloseButton: true,
        hideClearAllGrouping: false,
        hideCollapseAllGroups: false,
        hideCommandSection: false,
        hideCopyCellValueCommand: false,
        hideExpandAllGroups: false,
        hideExportCsvCommand: false,
        hideExportExcelCommand: false,
        hideExportTextDelimitedCommand: true,
        hideMenuOnScroll: true,
        hideOptionSection: false,
        iconCollapseAllGroupsCommand: 'mdi mdi-arrow-collapse',
        iconExpandAllGroupsCommand: 'mdi mdi-arrow-expand',
        iconClearGroupingCommand: 'mdi mdi-close',
        iconCopyCellValueCommand: 'mdi mdi-content-copy',
        iconExportCsvCommand: 'mdi mdi-download',
        iconExportExcelCommand: 'mdi mdi-file-excel-outline',
        iconExportTextDelimitedCommand: 'mdi mdi-download',
      },
      customFooterOptions: {
        dateFormat: 'YYYY-MM-DD, hh:mm a',
        hideRowSelectionCount: false,
        hideTotalItemCount: false,
        hideLastUpdateTimestamp: true,
        footerHeight: 25,
        leftContainerClass: 'col-xs-12 col-sm-5',
        rightContainerClass: 'col-xs-6 col-sm-7',
        metricSeparator: '|',
        metricTexts: {
          items: 'items',
          itemsKey: 'ITEMS',
          itemsSelected: 'items selected',
          itemsSelectedKey: 'ITEMS_SELECTED',
          of: 'of',
          ofKey: 'OF',
        },
      },

      dataView: {
        syncGridSelection: true, // when enabled, this will preserve the row selection even after filtering/sorting/grouping
        syncGridSelectionWithBackendService: false, // but disable it when using backend services
      },
      datasetIdPropertyName: 'id',
      defaultFilter: Filters.input,
      defaultBackendServiceFilterTypingDebounce: 500,
      defaultColumnSortFieldId: 'id',
      defaultFilterPlaceholder: '🔎︎',
      defaultFilterRangeOperator: OperatorType.rangeInclusive,
      editable: true,
      enableAutoResize: true,
      enableAutoSizeColumns: true,
      enableCellNavigation: true,
      enableColumnPicker: true,
      enableColumnReorder: true,
      enableColumnResizeOnDoubleClick: true,
      enableContextMenu: true,
      enableExcelExport: true, // Excel Export is the new default,

      registerExternalResources: [new ExcelExportService()],

      enableExport: false, // CSV/Text with Tab Delimited
      enableFilterTrimWhiteSpace: false, // do we want to trim white spaces on all Filters?
      enableGridMenu: true,
      enableHeaderMenu: true,
      enableEmptyDataWarningMessage: true,
      emptyDataWarning: {
        className: 'slick-empty-data-warning',
        message: 'No data to display.',
        messageKey: 'EMPTY_DATA_WARNING_MESSAGE',
        hideFrozenLeftWarning: false,
        hideFrozenRightWarning: false,
        leftViewportMarginLeft: '40%',
        rightViewportMarginLeft: '40%',
        frozenLeftViewportMarginLeft: '0px',
        frozenRightViewportMarginLeft: '40%',
      },
      enableMouseHoverHighlightRow: true,
      enableSorting: true,
      enableTextSelectionOnCells: true,
      eventNamingStyle: EventNamingStyle.camelCase,
      explicitInitialization: true,
      excelExportOptions: {
        addGroupIndentation: true,
        exportWithFormatter: false,
        filename: 'export',
        format: FileType.xlsx,
        groupingColumnHeaderTitle: 'Group By',
        groupCollapsedSymbol: '⮞',
        groupExpandedSymbol: '⮟',
        groupingAggregatorRowText: '',
        sanitizeDataExport: false,
      },
      exportOptions: {
        delimiter: DelimiterType.comma,
        exportWithFormatter: false,
        filename: 'export',
        format: FileType.csv,
        groupingColumnHeaderTitle: 'Group By',
        groupingAggregatorRowText: '',
        sanitizeDataExport: false,
        useUtf8WithBom: true,
      },
      filterTypingDebounce: 0,
      forceFitColumns: false,
      frozenHeaderWidthCalcDifferential: 0,
      gridMenu: {
        dropSide: 'left',
        commandLabels: {
          clearAllFiltersCommandKey: 'CLEAR_ALL_FILTERS',
          clearAllSortingCommandKey: 'CLEAR_ALL_SORTING',
          clearFrozenColumnsCommandKey: 'CLEAR_PINNING',
          exportCsvCommandKey: 'EXPORT_TO_CSV',
          exportExcelCommandKey: 'EXPORT_TO_EXCEL',
          exportTextDelimitedCommandKey: 'EXPORT_TO_TAB_DELIMITED',
          refreshDatasetCommandKey: 'REFRESH_DATASET',
          toggleFilterCommandKey: 'TOGGLE_FILTER_ROW',
          togglePreHeaderCommandKey: 'TOGGLE_PRE_HEADER_ROW',
        },
        hideClearAllFiltersCommand: false,
        hideClearAllSortingCommand: false,
        hideClearFrozenColumnsCommand: true, // opt-in command
        hideExportCsvCommand: false,
        hideExportExcelCommand: false,
        hideExportTextDelimitedCommand: true,
        hideForceFitButton: false,
        hideRefreshDatasetCommand: false,
        hideSyncResizeButton: true,
        hideToggleFilterCommand: false,
        hideTogglePreHeaderCommand: false,
        iconCssClass: 'mdi mdi-menu',
        iconClearAllFiltersCommand: 'mdi mdi-filter-remove-outline',
        iconClearAllSortingCommand: 'mdi mdi-swap-vertical',
        iconExportCsvCommand: 'mdi mdi-download',
        iconExportExcelCommand: 'mdi mdi-file-excel-outline',
        iconExportTextDelimitedCommand: 'mdi mdi-download',
        iconRefreshDatasetCommand: 'mdi mdi-sync',
        iconToggleFilterCommand: 'mdi mdi-flip-vertical',
        iconTogglePreHeaderCommand: 'mdi mdi-flip-vertical',
        menuWidth: 16,
        resizeOnShowHeaderRow: true,
        headerColumnValueExtractor: pickerHeaderColumnValueExtractor,
      },
      headerMenu: {
        autoAlign: true,
        autoAlignOffset: 12,
        minWidth: 140,
        iconColumnResizeByContentCommand: 'fa fa-arrows-h',
        iconClearFilterCommand: 'mdi mdi mdi-filter-remove-outline',
        iconClearSortCommand: 'mdi mdi-swap-vertical',
        iconSortAscCommand: 'mdi mdi-sort-ascending',
        iconSortDescCommand: 'mdi mdi-flip-v mdi-sort-descending',
        iconColumnHideCommand: 'mdi mdi-close',
        hideColumnResizeByContentCommand: false,
        hideColumnHideCommand: false,
        hideClearFilterCommand: false,
        hideClearSortCommand: false,
        hideFreezeColumnsCommand: true, // opt-in command
        hideSortCommands: false,
      },
      headerRowHeight: 45,
      multiColumnSort: true,
      numberedMultiColumnSort: true,
      tristateMultiColumnSort: false,
      sortColNumberInSeparateSpan: true,
      suppressActiveCellChangeOnEdit: true,
      pagination: {
        pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
        pageSize: 25,
        totalItems: 0,
      },
      // technically speaking the Row Detail requires the process & viewComponent but we'll ignore it just to set certain options
      rowDetailView: {
        collapseAllOnSort: true,
        cssClass: 'detail-view-toggle',
        panelRows: 1,
        keyPrefix: '__',
        useRowClick: false,
        useSimpleViewportCalc: true,
        saveDetailViewOnScroll: false,
      } as RowDetailView,

      topPanelHeight: 35,
      rowHeight: 50,
      translationNamespaceSeparator: ':',
      resetFilterSearchValueAfterOnBeforeCancellation: true,
      resizeByContentOnlyOnFirstLoad: true,
      resizeByContentOptions: {
        alwaysRecalculateColumnWidth: false,
        cellCharWidthInPx: 7.8,
        cellPaddingWidthInPx: 14,
        defaultRatioForStringType: 0.88,
        formatterPaddingWidthInPx: 0,
        maxItemToInspectCellContentWidth: 1000,
        maxItemToInspectSingleColumnWidthByContent: 5000,
        widthToRemoveFromExceededWidthReadjustment: 50,
      },
      treeDataOptions: ({
        exportIndentMarginLeft: 5,
        exportIndentationLeadingChar: '͏͏͏͏͏͏͏͏͏·',
      } as unknown) as TreeDataOption,
    }),
  ],
  exports: [AngularSlickgridModule],
})
export class SlickGridModule {}
function pickerHeaderColumnValueExtractor(column: Column) {
  const headerGroup = (column && column.columnGroup) || ''
  if (headerGroup) {
    return headerGroup + ' - ' + column.name
  }
  return (column && column.name) || ''
}
