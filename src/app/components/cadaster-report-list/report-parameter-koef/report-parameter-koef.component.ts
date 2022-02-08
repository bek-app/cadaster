 import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AngularGridInstance,
  AngularUtilService,
  Column,
  Editors,
  FieldType,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute } from '@angular/router';
import { CustomSelectEditor } from '../../editors/custom-select-editor/custom-select';
import { CustomSelectEditorComponent } from '../../editors/custom-select-editor/custom-select-editor.component';
import { ParameterKoefModel } from 'src/app/models/parameter-koef.model';
import { ParameterKoefService } from 'src/app/services/parameter-koef.service';
import {
  koefCaseBurningFormatter,
  koefCh4Formatter,
  koefCo2Formatter,
  koefLowerCalorificFormatter,
  koefN2OFormatter,
  koefOperatingWeightFormatter,
  koefPerfluorocarbonsFormatter,
  koefVolumeFormatter,
} from '../../formatters/parameterKoefFormatter';
import { reportCadasterTreeFormatter } from '../../formatters/reportCadasterTreeFormatter';
@Component({
  selector: 'app-report-parameter-koef',
  templateUrl: './report-parameter-koef.component.html',
  styleUrls: ['./report-parameter-koef.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportParameterKoefComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: ParameterKoefModel[] = [];
  cadasterId!: number;
  gridObj: any;
  dataViewObj: any;
  isExcludingChildWhenFiltering = false;
  isAutoApproveParentItemWhenTreeColumnIsValid = true;
  dicUnitList: any[] = [];
  private _commandQueue: any[] = [];

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
    this.dataViewObj.getItemMetadata = (row: any) => {
      const newCssClass = 'inactive__header';
      const item = this.dataViewObj.getItem(row);
      if (item.__hasChildren) {
        return {
          cssClasses: newCssClass,
        };
      } else {
        return '';
      }
    };
    this.gridObj.onBeforeEditCell.subscribe((e: any, args: any) => {
      if (args.item.__hasChildren) {
        return false;
      }
      return true;
    });
  }
  constructor(
    private parameterKoefService: ParameterKoefService,
    private activatedRoute: ActivatedRoute,
    private angularUtilService: AngularUtilService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response: any) => {
      this.dicUnitList = response.dicUnit;
    });
    this.refreshList(4);
    this.prepareGrid();
  }

  goToCadasterReports(id: number) {
    this.refreshList(id);
  }
  refreshList(reportId: number) {
    this.parameterKoefService
      .getParameterKoefById(reportId)
      .subscribe((data) => {
        data.forEach((items) => {
          items.materials.forEach((material: any) => {
            Object.assign(material, {
              processName: material.dicMaterialName,

              dicUnit: {
                id: material.dicUnitId,
                name: material.dicUnitName,
              },

              koefOperatingWeightUnit: {
                id: material.koefOperatingWeightUnitId,
                name: material.koefOperatingWeightUnitName,
              },

              koefLowerCalorificUnit: {
                id: material.koefLowerCalorificUnitId,
                name: material.koefLowerCalorificUnitName,
              },

              koefCaseBurningUnit: {
                id: material.koefCaseBurningUnitId,
                name: material.koefCaseBurningUnitName,
              },
              koefCo2Unit: {
                id: material.koefCo2UnitId,
                name: material.koefCo2UnitName,
              },
              koefCh4Unit: {
                id: material.koefCh4UnitId,
                name: material.koefCh4UnitName,
              },
              koefN2OUnit: {
                id: material.koefN2OUnitId,
                name: material.koefN2OUnitName,
              },
              // Перфторуглероды
              koefPerfluorocarbonsUnit: {
                id: material.koefPerfluorocarbonsUnitId,
                name: material.koefPerfluorocarbonsUnitName,
              },
            });
          });
        });
        console.log(data);

        this.dataset = data;
      });
  }
  addGridService(data: any) {
    this.angularGrid.gridService.addItem(
      { ...data },
      {
        highlightRow: false,
      }
    );
  }
  prepareGrid() {
    this.columnDefinitions = [
      {
        id: 'processName',
        name: 'Наименование производственного процесса',
        field: 'processName',
        type: FieldType.string,
        width: 120,
        formatter: reportCadasterTreeFormatter,
        filterable: true,
        sortable: true,
      },

      /// Фактический объем
      {
        id: 'koefVolume',
        name: 'Фактический объем',
        field: 'koefVolume',
        columnGroup: 'Наименование сырья',
        formatter: koefVolumeFormatter,
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const koefVolume = args.dataContext.koefVolume;
          const data = {
            id,
            nameField: 'KoefVolume',
            valueField: koefVolume.toString(),
          };
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },
      {
        id: 'dicUnit',
        name: 'Ед. измерения ',
        field: 'dicUnit',
        columnGroup: 'Наименование сырья',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'dicUnit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: CustomSelectEditorComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const dicUnit = args.dataContext.dicUnit;
          const data = {
            id,
            nameField: 'DicUnitId',
            valueField: dicUnit.id != null ? dicUnit.id.toString() : dicUnit.id,
          };
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },

      // Содержание углерода
      {
        id: 'koefOperatingWeight',
        name: 'Содержание углерода  ',
        field: 'koefOperatingWeight',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        formatter: koefOperatingWeightFormatter,
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const koefOperatingWeight = args.dataContext.koefOperatingWeight;
          const data = {
            id,
            nameField: 'KoefOperatingWeight',
            valueField: koefOperatingWeight.toString(),
          };
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },
      {
        id: 'koefOperatingWeightUnit',
        name: 'Ед.измерения',
        field: 'koefOperatingWeightUnit',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'koefOperatingWeightUnit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: CustomSelectEditorComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const koefOperatingWeightUnit =
            args.dataContext.koefOperatingWeightUnit;
          const data = {
            id,
            nameField: 'KoefOperatingWeightUnitId',
            valueField:
              koefOperatingWeightUnit.id != null
                ? koefOperatingWeightUnit.id.toString()
                : koefOperatingWeightUnit.id,
          };

          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },

      // Коэффициент низшей теплоты сгорания
      {
        id: 'koefLowerCalorific',
        name: 'Коэффициент низшей теплоты сгорания',
        field: 'koefLowerCalorific',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        formatter: koefLowerCalorificFormatter,
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const koefLowerCalorific = args.dataContext.koefLowerCalorific;
          const data = {
            id,
            nameField: 'KoefLowerCalorific',
            valueField: koefLowerCalorific.toString(),
          };
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },
      {
        id: 'koefLowerCalorificUnit',
        name: 'Ед.измерения',
        field: 'koefLowerCalorificUnit',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'koefLowerCalorificUnit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: CustomSelectEditorComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const koefLowerCalorificUnit =
            args.dataContext.koefLowerCalorificUnit;
          const data = {
            id,
            nameField: 'KoefLowerCalorificUnitId',
            valueField:
              koefLowerCalorificUnit.id != null
                ? koefLowerCalorificUnit.id.toString()
                : koefLowerCalorificUnit.id,
          };
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },

      // Коэффициент окисления
      {
        id: 'koefCaseBurning',
        name: 'Коэффициент окисления',
        field: 'koefCaseBurning',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        formatter: koefCaseBurningFormatter,
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const koefCaseBurning = args.dataContext.koefCaseBurning;
          const data = {
            id,
            nameField: 'KoefCaseBurning',
            valueField: koefCaseBurning.toString(),
          };
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => {
              this.addGridService(args.dataContext);
            });
        },
      },
      {
        id: 'koefCaseBurningUnit',
        name: 'Ед.измерения',
        field: 'koefCaseBurningUnit',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'koefCaseBurningUnit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: CustomSelectEditorComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const koefCaseBurningUnit = args.dataContext.koefCaseBurningUnit;
          const data = {
            id,
            nameField: 'KoefCaseBurningUnitId',
            valueField:
              koefCaseBurningUnit.id != null
                ? koefCaseBurningUnit.id.toString()
                : koefCaseBurningUnit.id,
          };
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },

      // Двуокись углерода (СО2)
      {
        id: 'koefCo2',
        name: 'Двуокись углерода (СО2)',
        field: 'koefCo2',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        formatter: koefCo2Formatter,
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const koefCo2 = args.dataContext.koefCo2;
          const data = {
            id,
            nameField: 'KoefCo2',
            valueField: koefCo2.toString(),
          };
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },
      {
        id: 'koefCo2Unit',
        name: 'Ед.измерения',
        field: 'koefCo2Unit',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'koefCo2Unit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: CustomSelectEditorComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const koefCo2Unit = args.dataContext.koefCo2Unit;
          const data = {
            id,
            nameField: 'KoefCo2UnitId',
            valueField:
              koefCo2Unit.id != null
                ? koefCo2Unit.id.toString()
                : koefCo2Unit.id,
          };
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },

      // Метан (СН4)
      {
        id: 'koefCh4',
        name: 'Метан (СН4)',
        field: 'koefCh4',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        formatter: koefCh4Formatter,
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const koefCh4 = args.dataContext.koefCh4;
          const data = {
            id,
            nameField: 'KoefCh4',
            valueField: koefCh4.toString(),
          };
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },
      {
        id: 'koefCh4Unit',
        name: 'Ед.измерения',
        field: 'koefCh4Unit',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'koefCh4Unit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: CustomSelectEditorComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const koefCh4Unit = args.dataContext.koefCh4Unit;
          const data = {
            id,
            nameField: 'KoefCh4UnitId',
            valueField:
              koefCh4Unit.id != null
                ? koefCh4Unit.id.toString()
                : koefCh4Unit.id,
          };
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },

      // Закиси азота (N2O)
      {
        id: 'koefN2O',
        name: 'Закиси азота (N2O)',
        field: 'koefN2O',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        formatter: koefN2OFormatter,
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const koefN2O = args.dataContext.koefN2O;
          const data = {
            id,
            nameField: 'KoefN2O',
            valueField: koefN2O.toString(),
          };
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },
      {
        id: 'koefN2OUnit',
        name: 'Ед.измерения',
        field: 'koefN2OUnit',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'koefN2OUnit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: CustomSelectEditorComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const koefN2OUnit = args.dataContext.koefN2OUnit;
          const data = {
            id,
            nameField: 'KoefN2OUnitId',
            valueField:
              koefN2OUnit.id != null
                ? koefN2OUnit.id.toString()
                : koefN2OUnit.id,
          };
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },

      // Перфторуглероды
      {
        id: 'koefPerfluorocarbons',
        name: 'Перфторуглероды',
        field: 'koefPerfluorocarbons',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        formatter: koefPerfluorocarbonsFormatter,
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const koefPerfluorocarbons = args.dataContext.koefPerfluorocarbons;
          const data = {
            id,
            nameField: 'KoefPerfluorocarbons',
            valueField: koefPerfluorocarbons.toString(),
          };
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },
      {
        id: 'koefPerfluorocarbonsUnit',
        name: 'Ед.измерения',
        field: 'koefPerfluorocarbonsUnit',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'koefPerfluorocarbonsUnit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: CustomSelectEditorComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const koefPerfluorocarbonsUnit =
            args.dataContext.koefPerfluorocarbonsUnit;
          const data = {
            id,
            nameField: 'KoefPerfluorocarbonsUnitId',
            valueField:
              koefPerfluorocarbonsUnit.id != null
                ? koefPerfluorocarbonsUnit.id.toString()
                : koefPerfluorocarbonsUnit.id,
          };
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },
    ];

    this.gridOptions = {
      autoResize: {
        container: '#demo-container',
      },
      gridWidth: '100%',
      enableAutoSizeColumns: true,
      enableAutoResize: true,
      enableExcelExport: true,
      excelExportOptions: {
        exportWithFormatter: true,
        sanitizeDataExport: true,
      },
      autoEdit: true,
      autoCommitEdit: true,
      enableCellNavigation: true,
      editable: true,
      enableFiltering: true,
      enableGrouping: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      enableTreeData: true, // you must enable this flag for the filtering & sorting to work as expected
      multiColumnSort: false, // multi-column sorting is not supported with Tree Data, so you need to disable it
      treeDataOptions: {
        columnId: 'processName',
        childrenPropName: 'materials',
        excludeChildrenWhenFilteringTree: this.isExcludingChildWhenFiltering, // defaults to false

        autoApproveParentItemWhenTreeColumnIsValid:
          this.isAutoApproveParentItemWhenTreeColumnIsValid,
      },
      params: {
        angularUtilService: this.angularUtilService, // provide the service to all at once (Editor, Filter, AsyncPostRender)
      },
      // change header/cell row height for salesforce theme
      headerRowHeight: 45,
      rowHeight: 45,
      showCustomFooter: true,

      // we can also preset collapsed items via Grid Presets (parentId: 4 => is the "pdf" folder)
      presets: {
        treeData: { toggledItems: [{ itemId: 4, isCollapsed: true }] },
      },
      // use Material Design SVG icons
      contextMenu: {
        iconCollapseAllGroupsCommand: 'mdi mdi-arrow-collapse',
        iconExpandAllGroupsCommand: 'mdi mdi-arrow-expand',
        iconClearGroupingCommand: 'mdi mdi-close',
        iconCopyCellValueCommand: 'mdi mdi-content-copy',
        iconExportCsvCommand: 'mdi mdi-download',
        iconExportExcelCommand: 'mdi mdi-file-excel-outline',
        iconExportTextDelimitedCommand: 'mdi mdi-download',
      },
      gridMenu: {
        iconCssClass: 'mdi mdi-menu',
        iconClearAllFiltersCommand: 'mdi mdi-filter-remove-outline',
        iconClearAllSortingCommand: 'mdi mdi-swap-vertical',
        iconExportCsvCommand: 'mdi mdi-download',
        iconExportExcelCommand: 'mdi mdi-file-excel-outline',
        iconExportTextDelimitedCommand: 'mdi mdi-download',
        iconRefreshDatasetCommand: 'mdi mdi-sync',
        iconToggleFilterCommand: 'mdi mdi-flip-vertical',
        iconTogglePreHeaderCommand: 'mdi mdi-flip-vertical',
      },
      headerMenu: {
        iconClearFilterCommand: 'mdi mdi mdi-filter-remove-outline',
        iconClearSortCommand: 'mdi mdi-swap-vertical',
        iconSortAscCommand: 'mdi mdi-sort-ascending',
        iconSortDescCommand: 'mdi mdi-flip-v mdi-sort-descending',
        iconColumnHideCommand: 'mdi mdi-close',
      },
    };
  }
}
