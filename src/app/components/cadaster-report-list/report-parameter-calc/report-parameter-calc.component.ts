import {
  Component,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AngularGridInstance,
  AngularUtilService,
  Column,
  Editors,
  FieldType,
  Formatters,
  GridOption,
  OnEventArgs,
  SharedService,
} from 'angular-slickgrid';
import { ParameterCalc } from 'src/app/models/parameter-calc.model';
import { ParameterCalcService } from 'src/app/services/parameter-calc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomNgSelectEditor } from '../../editors/custom-ngselect-editor';
import { EditorNgSelectComponent } from '../../editors/editor-ng-select/editor-ng-select.component';
import { parameterCalcFormatter } from '../../formatters/parameterCalcFormatter';
import { reportCadasterTreeFormatter } from '../../formatters/reportCadasterTreeFormatter';
import { CustomTextAreaEditor } from '../../editors/custom-textarea-editor';
import { EditorTextAreaComponent } from '../../editors/editor-textarea/editor-textarea.component';
import { ReportSharedService } from 'src/app/services/report-shared.service';
import { ReportCommentService } from 'src/app/services/report-comment.service';
@Component({
  selector: 'app-report-parameter-calc',
  templateUrl: './report-parameter-calc.component.html',
  styleUrls: ['./report-parameter-calc.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportParameterCalcComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: ParameterCalc[] = [];
  cadasterId!: number;
  gridObj: any;
  dataViewObj: any;
  isExcludingChildWhenFiltering = false;
  isAutoApproveParentItemWhenTreeColumnIsValid = true;
  dicUnitList: any[] = [];
  editMode = false;
  cdrReportId!: number;
  list: any[] = [];
  textArea!: EditorTextAreaComponent;
  @ViewChild(EditorTextAreaComponent) editTextArea!: EditorTextAreaComponent;
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
      }
      return '';
    };

    this.gridObj.onBeforeEditCell.subscribe((e: any, args: any) => {
      if (!args.item.__hasChildren) {
        // this.editTextArea.comments(args.item);
        return true;
      }
      return false;
    });
  }

  constructor(
    private parameterCalcService: ParameterCalcService,
    private activatedRoute: ActivatedRoute,
    private angularUtilService: AngularUtilService,
    private reportSharedService: ReportSharedService,
    private router: Router,
    private reportCommentService: ReportCommentService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((res: any) => {
      this.dicUnitList = res.dicUnit;
    });
    this.refreshList(4);
    this.prepareGrid();
  }

  anyFunction(id: number) {
    this.cdrReportId = id;
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
              dicUnit: {
                id: material.paramCalcUnitId,
                name: material.paramCalcUnitName,
              },
            });
          });
        });
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

      {
        id: 'q4',
        name: 'Потеря тепла вследствии механической неполнотой сгорания (q4), %',
        field: 'q4',
        columnGroup: 'Вариант А',
        formatter: parameterCalcFormatter,
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: {
          model: CustomTextAreaEditor,
          params: {
            component: EditorTextAreaComponent,
          },
        },
        onCellClick: (e: Event, args: OnEventArgs) => {
          const { id, q4 } = args.dataContext;
          const newComment = {
            id: 0,
            note: q4,
            recordId: id.toString(),
            controlId: 'Q4',
            controlValue: 'string',
            discriminator: 'calc',
            isMark: true,
            isActive: true,
            reportId: this.cdrReportId,
          };
          console.log(EditorTextAreaComponent);

          this.reportSharedService.setMessage(newComment);
        },
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
            .subscribe((res: any) => {
              this.addGridService(args.dataContext);
            });
        },
      },
      {
        id: 'q3',
        name: 'Потеря тепла вследствии химической неполнотой сгорания (q3), %',
        field: 'q3',
        columnGroup: 'Вариант А',
        formatter: parameterCalcFormatter,

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
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },

      {
        id: 'slagCarbon',
        name: 'Содержание углерода в шлаке',
        field: 'slagCarbon',
        columnGroup: 'Вариант Б',
        formatter: parameterCalcFormatter,

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
            .subscribe((res: any) => this.addGridService(args.dataContext));
        },
      },
      {
        id: 'dicUnit',
        name: 'Единица измерения ',
        field: 'dicUnit',
        columnGroup: 'Вариант Б',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'dicUnit.name',
        },
        editor: {
          model: CustomNgSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: EditorNgSelectComponent,
          },
        },
        exportWithFormatter: true,

        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const dicUnit = args.dataContext.dicUnit;

          const data = {
            id,
            nameField: 'ParamCalcUnitId',
            valueField: dicUnit.id != null ? dicUnit.id.toString() : dicUnit.id,
          };
          this.parameterCalcService.addParameterCalc(data).subscribe((res) => {
            this.addGridService(args.dataContext);
          });
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
            .subscribe((res: any) => this.addGridService(args.dataContext));
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
  renderAngularComponent(
    cellNode: HTMLElement,
    row: number,
    dataContext: any,
    colDef: Column
  ) {
    if (colDef.params.component) {
      const componentOutput = this.angularUtilService.createAngularComponent(
        colDef.params.component
      );
      Object.assign(componentOutput.componentRef.instance, {
        item: dataContext,
      });

      // use a delay to make sure Angular ran at least a full cycle and make sure it finished rendering the Component
      setTimeout(() => $(cellNode).empty().html(componentOutput.domElement));
    }
  }
}