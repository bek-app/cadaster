import { HttpClient, HttpClientModule } from '@angular/common/http'
import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  Injector,
  NgModule,
} from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core'
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
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { PlantListComponent } from './components/plant-list/plant-list.component'
import { PlantSourceListComponent } from './components/plant-list/plant-source-list/plant-source-list.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PlantProcessListComponent } from './components/plant-list/plant-process-list/plant-process-list.component'
import { PlantDeviceListComponent } from './components/plant-list/plant-device-list/plant-device-list.component'
import { DicFormComponent } from './components/dic-form/dic-form.component'
import { DeviceFormComponent } from './components/plant-list/plant-device-list/device-form/device-form.component'
import { ProcessFormComponent } from './components/plant-list/plant-process-list/process-form/process-form.component'
import { PlantFormComponent } from './components/plant-list/plant-form/plant-form.component'
import { SourceFormComponent } from './components/plant-list/plant-source-list/source-form/source-form.component'
import { PlantSamplingListComponent } from './components/plant-list/plant-sampling-list/plant-sampling-list.component'
import { SamplingFormComponent } from './components/plant-list/plant-sampling-list/sampling-form/sampling-form.component'
import { CadasterReportListComponent } from './components/cadaster-report-list/cadaster-report-list.component'
import { ReportActualEmissionComponent } from './components/cadaster-report-list/report-actual-emission/report-actual-emission.component'
import { CadasterReportComponent } from './components/cadaster-report/cadaster-report.component'
import { CadasterReportFormComponent } from './components/cadaster-report/cadaster-report-form/cadaster-report-form.component'
import { ReportParameterCalcComponent } from './components/cadaster-report-list/report-parameter-calc/report-parameter-calc.component'
import { CustomSelectEditorComponent } from './components/editors/custom-select-editor/custom-select-editor.component'
import { ReportParameterGasComponent } from './components/cadaster-report-list/report-parameter-gas/report-parameter-gas.component'
import { PlantProductListComponent } from './components/plant-list/plant-product-list/plant-product-list.component'
import { PlantProductFormComponent } from './components/plant-list/plant-product-list/plant-product-form/plant-product-form.component'
import { ReportProductComponent } from './components/cadaster-report-list/report-product/report-product.component'
import { ReportParameterKoefComponent } from './components/cadaster-report-list/report-parameter-koef/report-parameter-koef.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ReportCommentEditorComponent } from './components/cadaster-report-list/report-comment-editor/report-comment-editor.component'
import { CommentHistoryComponent } from './components/cadaster-report-list/report-comment-editor/comment-history/comment-history.component'
import { CustomInputEditorComponent } from './components/editors/custom-input-editor/custom-input-editor.component'
import { AngularMaterialModule } from './modules/material.module'
import { FlexLayoutModule } from '@angular/flex-layout'
import { NgSelectModule } from '@ng-select/ng-select'
import { LOCATION_INITIALIZED } from '@angular/common'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import {
  MatFormFieldDefaultOptions,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field'
import { CadasterReportCheckComponent } from './components/cadaster-report-check/cadaster-report-check.component'
import { CdrReportCheckListsComponent } from './components/cdr-report-check-list/cdr-report-check-list.component'
import { PlantPlannedChangesComponent } from './components/plant-list/plant-planned-changes/plant-planned-changes.component'
import { PlannedChangesFormComponent } from './components/plant-list/plant-planned-changes/planned-changes-form/planned-changes-form.component'
import { ExcelExportService } from '@slickgrid-universal/excel-export'

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline',
}
// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

// use an Initializer Factory as describe here: https://github.com/ngx-translate/core/issues/517#issuecomment-299637956
export function appInitializerFactory(
  translate: TranslateService,
  injector: Injector,
) {
  return () =>
    new Promise<any>((resolve: any) => {
      const locationInitialized = injector.get(
        LOCATION_INITIALIZED,
        Promise.resolve(null),
      )
      locationInitialized.then(() => {
        const langToSet = 'ru'
        translate.setDefaultLang('ru')
        translate.use(langToSet).subscribe(
          () => {
            // console.report-info(`Successfully initialized '${langToSet}' language.'`);
          },
          (err) => {
            console.error(
              `Problem with '${langToSet}' language initialization.'`,
            )
          },
          () => {
            resolve(null)
          },
        )
      })
    })
}
@NgModule({
  declarations: [
    AppComponent,
    PlantListComponent,
    PlantSourceListComponent,
    PlantProcessListComponent,
    PlantDeviceListComponent,
    DicFormComponent,
    DeviceFormComponent,
    ProcessFormComponent,
    PlantFormComponent,
    SourceFormComponent,
    PlantSamplingListComponent,
    SamplingFormComponent,
    CadasterReportListComponent,
    ReportActualEmissionComponent,
    CadasterReportComponent,
    CadasterReportFormComponent,
    ReportParameterCalcComponent,
    CustomSelectEditorComponent,
    PlantProductListComponent,
    PlantProductFormComponent,
    ReportProductComponent,
    ReportParameterKoefComponent,
    ReportParameterGasComponent,
    ReportCommentEditorComponent,
    CommentHistoryComponent,
    CustomInputEditorComponent,
    CadasterReportCheckComponent,
    CdrReportCheckListsComponent,
    PlantPlannedChangesComponent,
    PlannedChangesFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularSlickgridModule.forRoot({
      alwaysShowVerticalScroll: true,
      autoEdit: false,
      asyncEditorLoading: false,
      autoFitColumnsOnFirstLoad: true,
      autoResize: {
        applyResizeToContainer: true,
        calculateAvailableSizeBy: 'window',
        bottomPadding: 20,
        minHeight: 180,
        minWidth: 300,
        rightPadding: 0,
      },
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
        iconCopyCellValueCommand: 'fa fa-clone',
        iconExportCsvCommand: 'fa fa-download',
        iconExportExcelCommand: 'fa fa-file-excel-o text-success',
        iconExportTextDelimitedCommand: 'fa fa-download',
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
      editable: false,
      enableAutoResize: true,
      enableAutoSizeColumns: true,
      enableCellNavigation: false,
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
        iconCssClass: 'fa fa-bars',
        iconClearAllFiltersCommand: 'fa fa-filter text-danger',
        iconClearAllSortingCommand: 'fa fa-unsorted text-danger',
        iconClearFrozenColumnsCommand: 'fa fa-times',
        iconExportCsvCommand: 'fa fa-download',
        iconExportExcelCommand: 'fa fa-file-excel-o text-success',
        iconExportTextDelimitedCommand: 'fa fa-download',
        iconRefreshDatasetCommand: 'fa fa-refresh',
        iconToggleFilterCommand: 'fa fa-random',
        iconTogglePreHeaderCommand: 'fa fa-random',
        menuWidth: 16,
        resizeOnShowHeaderRow: true,
        headerColumnValueExtractor: pickerHeaderColumnValueExtractor,
      },
      headerMenu: {
        autoAlign: true,
        autoAlignOffset: 12,
        minWidth: 140,
        iconClearFilterCommand: 'fa fa-filter text-danger',
        iconClearSortCommand: 'fa fa-unsorted',
        iconFreezeColumns: 'fa fa-thumb-tack',
        iconSortAscCommand: 'fa fa-sort-amount-asc',
        iconSortDescCommand: 'fa fa-sort-amount-desc',
        iconColumnHideCommand: 'fa fa-times',
        iconColumnResizeByContentCommand: 'fa fa-arrows-h',
        hideColumnResizeByContentCommand: false,
        hideColumnHideCommand: false,
        hideClearFilterCommand: false,
        hideClearSortCommand: false,
        hideFreezeColumnsCommand: true, // opt-in command
        hideSortCommands: false,
      },
      headerRowHeight: 35,
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
      rowHeight: 35,
      topPanelHeight: 35,
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true,
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
function pickerHeaderColumnValueExtractor(column: Column) {
  const headerGroup = (column && column.columnGroup) || ''
  if (headerGroup) {
    return headerGroup + ' - ' + column.name
  }
  return (column && column.name) || ''
}
