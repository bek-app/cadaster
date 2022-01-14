import { reportCadasterTreeFormatter } from '../report-actual-emission/report-actual-emission.component';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  AngularGridInstance,
  AngularUtilService,
  AutocompleteOption,
  BsDropDownService,
  Column,
  Editors,
  ExcelExportService,
  FieldType,
  Filters,
  Formatter,
  Formatters,
  GridOption,
  MultipleSelectOption,
  Observable,
  OnEventArgs,
  OperatorType,
  SlickDataView,
} from 'angular-slickgrid';
import { ActivatedRoute } from '@angular/router';
import { CustomAngularComponentEditor } from '../custom-angular-editor';
import { EditorNgSelectComponent } from '../../editor-ng-select/editor-ng-select.component';
import { DicUnitService } from 'src/app/services/dic-unit.service';
import { ParameterGasService } from 'src/app/services/parameter-gas.service';
import { ParameterGasModel } from 'src/app/models/parameter-gas.model';
@Component({
  selector: 'app-report-parameter-gas',
  templateUrl: './report-parameter-gas.component.html',
  styleUrls: ['./report-parameter-gas.component.css'],
})
export class ReportParameterGasComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: ParameterGasModel[] = [];
  cadasterId!: number;
  gridObj: any;
  dataViewObj: any;
  isExcludingChildWhenFiltering = false;
  isAutoApproveParentItemWhenTreeColumnIsValid = true;
  complexityLevelList: any[] = [];
  private _commandQueue: any[] = [];

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
    this.dataViewObj.getItemMetadata = (row: any) => {
      const newCssClass = 'bg-secondary bg-opacity-50 text-white';
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
    private parameterGasService: ParameterGasService,
    private activatedRoute: ActivatedRoute,
    private angularUtilService: AngularUtilService,
    private dicUnitService: DicUnitService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response: any) => {
      this.complexityLevelList = response.dicUnit;
    });
    this.prepareGrid();
    this.refreshList(5);
  }

  anyFunction(id: number) {
    this.refreshList(id);
  }
  refreshList(reportId: number) {
    this.parameterGasService.getParameterGasById(reportId).subscribe((data) => {
      data.forEach((items) => {
        items.materials.forEach((material: any) => {
          Object.assign(material, {
            processName: material.dicMaterialName,
            gasCh4Unit: {
              id: material.gasCh4UnitId,
              name: material.gasCh4UnitName,
            },
            gasN2OUnit: {
              id: material.gasN2OUnitId,
              name: material.gasN2OUnitName,
            },
          });
        });
      });
      this.dataset = data;
    });
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

      {
        id: 'gasCh4',
        name: 'Измеренная объемная концентрация метана',
        field: 'gasCh4',
        columnGroup: 'Коэффициент выбросов',
        headerCssClass: 'text',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const gasCh4 = args.dataContext.gasCh4;
          const data = {
            id,
            nameField: 'GasCh4',
            valueField: gasCh4.toString(),
          };
          this.parameterGasService
            .addParameterGas(data)
            .subscribe((res: any) => {});
        },
      },
      {
        id: 'gasCh4Unit',
        name: 'Единица измерения ',
        field: 'gasCh4Unit',
        columnGroup: 'Коэффициент выбросов',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'gasCh4Unit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomAngularComponentEditor,
          collection: this.complexityLevelList,
          params: {
            component: EditorNgSelectComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const gasCh4Unit = args.dataContext.gasCh4Unit;
          const data = {
            id,
            nameField: 'GasCh4UnitId',
            valueField: gasCh4Unit.id.toString(),
          };
          this.parameterGasService
            .addParameterGas(data)
            .subscribe((res: any) => {});
        },
      },
      {
        id: 'gasN2O',
        name: 'Измеренная объемная концентрация закиси азота',
        field: 'gasN2O',
        columnGroup: 'Коэффициент выбросов',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const gasN2O = args.dataContext.gasN2O;
          const data = {
            id,
            nameField: 'GasN2O',
            valueField: gasN2O.toString(),
          };
          this.parameterGasService
            .addParameterGas(data)
            .subscribe((res: any) => {});
        },
      },
      {
        id: 'gasN2OUnit',
        name: 'Единица измерения ',
        field: 'gasN2OUnit',
        columnGroup: 'Коэффициент выбросов',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'gasN2OUnit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomAngularComponentEditor,
          collection: this.complexityLevelList,
          params: {
            component: EditorNgSelectComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const gasN2OUnit = args.dataContext.gasN2OUnit;
          const data = {
            id,
            nameField: 'GasN2OUnitId',
            valueField: gasN2OUnit.id.toString(),
          };
          this.parameterGasService
            .addParameterGas(data)
            .subscribe((res: any) => {});
        },
      },
      {
        id: 'gasProcО2',
        name: 'Измеренная концентрация кислорода (О2)',
        field: 'gasProcО2',
        columnGroup: 'Коэффициент выбросов',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const gasProcО2 = args.dataContext.gasProcО2;
          const data = {
            id,
            nameField: 'GasProcО2',
            valueField: gasProcО2.toString(),
          };
          this.parameterGasService
            .addParameterGas(data)
            .subscribe((res: any) => {});
        },
      },

      {
        id: 'gasKoeffFuelNature',
        name: 'Коэффициент, учитывающий характер топлива',
        field: 'gasKoeffFuelNature',
        columnGroup: 'Коэффициент выбросов',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const gasKoeffFuelNature = args.dataContext.gasKoeffFuelNature;
          const data = {
            id,
            nameField: 'GasKoeffFuelNature',
            valueField: gasKoeffFuelNature.toString(),
          };
          this.parameterGasService
            .addParameterGas(data)
            .subscribe((res: any) => {});
        },
      },
      {
        id: 'gasWeightN2O',
        name: 'Удельная масса загрязняющих веществ,закись азота (N2O), кг/нм^3',
        field: 'gasWeightN2O',
        columnGroup: 'Коэффициент выбросов',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const gasWeightN2O = args.dataContext.gasWeightN2O;
          const data = {
            id,
            nameField: 'GasWeightN2O',
            valueField: gasWeightN2O.toString(),
          };
          this.parameterGasService
            .addParameterGas(data)
            .subscribe((res: any) => {});
        },
      },
      {
        id: 'gasWeightCh4',
        name: 'Удельная масса загрязняющих веществ, метан (CH4)',
        field: 'gasWeightCh4',
        columnGroup: 'Коэффициент выбросов',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const gasWeightCh4 = args.dataContext.gasWeightCh4;
          const data = {
            id,
            nameField: 'GasWeightCh4',
            valueField: gasWeightCh4.toString(),
          };
          this.parameterGasService
            .addParameterGas(data)
            .subscribe((res: any) => {});
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
      editCommandHandler: (item, column, editCommand) => {
        this._commandQueue.push(editCommand);
        editCommand.execute();
      },
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
      headerRowHeight: 45,
      rowHeight: 45, // increase row height so that the ng-select fits in the cell
      editable: true,
      enableCellMenu: true,
      enableCellNavigation: true,
      enableColumnPicker: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      enableAsyncPostRender: true, // for the Angular PostRenderer, don't forget to enable it
      asyncPostRenderDelay: 0, // also make sure to remove any delay to render it

      params: {
        angularUtilService: this.angularUtilService, // provide the service to all at once (Editor, Filter, AsyncPostRender)
      },
      autoEdit: true,
      autoCommitEdit: true,

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
      // change header/cell row height for salesforce theme

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
