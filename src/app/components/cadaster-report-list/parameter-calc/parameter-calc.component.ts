import { reportCadasterTreeFormatter } from './../actual-emission/actual-emission.component';
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
import { ParameterCalc } from 'src/app/models/parameter-calc.model';
import { ParameterCalcService } from 'src/app/services/parameter-calc.service';
import { ActivatedRoute } from '@angular/router';
import { CustomAngularComponentEditor } from '../custom-angular-editor';
import { EditorNgSelectComponent } from '../../editor-ng-select/editor-ng-select.component';
import { DicUnitService } from 'src/app/services/dic-unit.service';
@Component({
  selector: 'app-parameter-calc',
  templateUrl: './parameter-calc.component.html',
  styleUrls: ['./parameter-calc.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ParameterCalcComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: ParameterCalc[] = [];
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
    private parameterCalcService: ParameterCalcService,
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
    this.parameterCalcService
      .getParameterCalcById(reportId)
      .subscribe((data) => {
        data.forEach((items) => {
          items.materials.forEach((material: any) => {
            Object.assign(material, {
              processName: material.dicMaterialName,
              item: {
                id: material.paramCalcUnitId,
                name: material.paramCalcUnitName,
              },
            });
          });
        });
        console.log(data);
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
        id: 'q4',
        name: 'Потеря тепла вследствии механической неполнотой сгорания (q4), %',
        field: 'q4',
        columnGroup: 'Вариант А',
        headerCssClass: 'text',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const q4 = args.dataContext.q4;
          const data = {
            id,
            nameField: 'Q4',
            valueField: q4.toString(),
          };
          this.parameterCalcService
            .addParameterCalc(data)
            .subscribe((res: any) => {});
        },
      },
      {
        id: 'q3',
        name: 'Потеря тепла вследствии химической неполнотой сгорания (q3), %',
        field: 'q3',
        columnGroup: 'Вариант А',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const q3 = args.dataContext.q3;
          const data = {
            id,
            nameField: 'Q3',
            valueField: q3.toString(),
          };
          this.parameterCalcService
            .addParameterCalc(data)
            .subscribe((res: any) => {});
        },
      },

      {
        id: 'slagCarbon',
        name: 'Содержание углерода в шлаке',
        field: 'slagCarbon',
        columnGroup: 'Вариант Б',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const slagCarbon = args.dataContext.slagCarbon;
          const data = {
            id,
            nameField: 'SlagCarbon',
            valueField: slagCarbon.toString(),
          };
          this.parameterCalcService
            .addParameterCalc(data)
            .subscribe((res: any) => {});
        },
      },
      {
        id: 'item',
        name: 'Единица измерения ',
        field: 'item',
        columnGroup: 'Вариант Б',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'item.name',
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
          const item = args.dataContext.item;
          const data = {
            id,
            nameField: 'ParamCalcUnitId',
            valueField: item.id.toString(),
          };
          this.parameterCalcService
            .addParameterCalc(data)
            .subscribe((res: any) => {});
        },
      },

      {
        id: 'slagAmount',
        name: ' Количество шлака, образованного за период z, тонн',
        field: 'slagAmount',
        columnGroup: 'Вариант Б',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const slagAmount = args.dataContext.slagAmount;
          const data = {
            id,
            nameField: 'SlagAmount',
            valueField: slagAmount.toString(),
          };
          this.parameterCalcService
          .addParameterCalc(data)
          .subscribe((res: any) => {});
        },
      },
      {
        id: 'fuelConsumption',
        name: 'Расход топлива в натуральном виде за период z, тонн',
        field: 'fuelConsumption',
        columnGroup: 'Вариант Б',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const fuelConsumption = args.dataContext.fuelConsumption;
          const data = {
            id,
            nameField: 'FuelConsumption',
            valueField: fuelConsumption.toString(),
          };
          this.parameterCalcService
            .addParameterCalc(data)
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
