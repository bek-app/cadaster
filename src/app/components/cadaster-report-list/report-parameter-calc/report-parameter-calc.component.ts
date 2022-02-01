import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AngularGridInstance,
  AngularUtilService,
  Column,
  Editors,
  FieldType,
  Formatters,
  Formatter,
  GridOption,
  OnEventArgs,
  SharedService,
  SlickGrid,
} from 'angular-slickgrid';
import { ParameterCalc } from 'src/app/models/parameter-calc.model';
import { ParameterCalcService } from 'src/app/services/parameter-calc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomNgSelectEditor } from '../../editors/editor-ng-select/custom-ngselect-editor';
import { EditorNgSelectComponent } from '../../editors/editor-ng-select/editor-ng-select.component';
import { parameterCalcFormatter } from '../../formatters/parameterCalcFormatter';
import { reportCadasterTreeFormatter } from '../../formatters/reportCadasterTreeFormatter';
import {
  MatDialog,
  MAT_DIALOG_SCROLL_STRATEGY,
} from '@angular/material/dialog';
import { SlickCustomTooltip } from '@slickgrid-universal/custom-tooltip-plugin';
import { ReportCommentService } from 'src/app/services/report-comment.service';
import { ReportCommentModel } from 'src/app/models/report-comment.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ReportCommentEditorComponent } from '../report-comment-editor/report-comment-editor.component';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/services/notification.service';

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
  gridObj: any;
  dataViewObj: any;
  isExcludingChildWhenFiltering = false;
  isAutoApproveParentItemWhenTreeColumnIsValid = true;
  dicUnitList: any[] = [];
  cdrReportId!: number;
  dialogRef: any;
  commentList: ReportCommentModel[] = [];
  editMode: boolean = false;
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
      if (!args.item.__hasChildren && this.editMode) {
        return true;
      }
      return false;
    });
  }
  constructor(
    private parameterCalcService: ParameterCalcService,
    private activatedRoute: ActivatedRoute,
    private angularUtilService: AngularUtilService,
    public dialog: MatDialog,
    private commentService: ReportCommentService,
    private _snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getCommentList();
    this.activatedRoute.data.subscribe(
      (res: any) => (this.dicUnitList = res.dicUnit)
    );
    this.refreshList(2);
    this.prepareGrid();
  }

  getCommentList(): void {
    this.commentService
      .getReportCommentList((this.cdrReportId = 2), 'calc')
      .subscribe((data: any) => {
        this.commentList = data;
      });
  }

  parameterCalcFormatter: Formatter = (
    row: number,
    cell: number,
    value: any,
    columnDef: Column,
    dataContext: any,
    grid?: any
  ) => {
    const { id, __hasChildren, dicUnit } = dataContext;
    const { field } = columnDef;
    const res = this.commentList.find((comment) => {
      return comment.recordId === id.toString() && comment.controlId === field;
    });
    return {
      addClasses: res ? 'border border-danger' : '',
      text: !dataContext.__hasChildren ? value : '',
    };
  };

  goToCadasterReports(id: number) {
    this.cdrReportId = id;
    this.getCommentList();
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

  openCommentDialog(comment: ReportCommentModel) {
    this.dialogRef = this.dialog.open(ReportCommentEditorComponent, {
      autoFocus: true,
      minWidth: '400px',
      width: '500px',
      data: { ...comment },
      backdropClass: 'dialog-bg-trans',
      panelClass: 'my-dialog',
    });

    this.dialogRef.componentInstance.saveComment.subscribe((result: any) => {
      !result.isError
        ? this.notificationService.success('Successfully', 'Done')
        : this.notificationService.error('Error', 'Done');

      this.getCommentList();
      this.refreshList(this.cdrReportId);
    });
  }

  onCellClicked(e: Event, args: OnEventArgs) {
    if (!this.editMode) {
      const metadata =
        this.angularGrid.gridService.getColumnFromEventArguments(args);
      const { id } = metadata.dataContext;
      const { field } = metadata.columnDef;

      if (field !== 'processName') {
        for (const item in metadata.dataContext) {
          if (field === item) {
            let controlValue = metadata.dataContext[item];
            let newControlValue;

            if (typeof controlValue === 'object' && controlValue !== null) {
              newControlValue = controlValue.name;
            } else if (controlValue === null) {
              newControlValue = controlValue;
            } else newControlValue = controlValue.toString();

            const comment: ReportCommentModel = {
              id: 0,
              note: '',
              recordId: id.toString(),
              controlId: field,
              controlValue: newControlValue,
              discriminator: 'calc',
              isMark: true,
              isActive: true,
              reportId: this.cdrReportId,
            };
            this.openCommentDialog(comment);
          }
        }
      }
    }
  }

  onCellChanged(e: Event, args: OnEventArgs) {}

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
        formatter: Formatters.multiple,
        params: {
          formatters: [this.parameterCalcFormatter],
        },
        editor: { model: Editors.integer },
        filterable: true,
        sortable: true,
        type: FieldType.number,
        // customTooltip: {
        //   position: 'right-align',
        //   formatter: () =>
        //     `<div><span class="fa fa-spinner fa-pulse fa-fw"></span> loading...</div>`,
        //   asyncProcess: (
        //     row: number,
        //     cell: number,
        //     value: any,
        //     column: Column,
        //     dataContext: any
        //   ) => {
        //     const id = dataContext.id.toString();
        //     let item = this.commentList.find(
        //       (comment: any) =>
        //         comment.recordId === id && comment.controlId === 'q4'
        //     );
        //     return new Promise((resolve, reject) => {
        //       item?.note ? resolve(item) : resolve({});
        //     });
        //   },
        //   asyncPostFormatter: this.tooltipTaskAsyncFormatter as Formatter,
        // },

        onCellChange: (e: Event, args: OnEventArgs) => {
          const { id, q4 } = args.dataContext;
          const data = {
            id,
            nameField: 'Q4',
            valueField: q4.toString(),
          };
          this.parameterCalcService
            .addParameterCalc(data)
            .subscribe((result: any) => {
              result.isSuccess
                ? this.notificationService.success(
                    '“Ваши данные сохранены”',
                    'Done'
                  )
                : this.notificationService.error(`${result.message}`, 'Done');
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
      registerExternalResources: [new SlickCustomTooltip()],

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

  tooltipTaskAsyncFormatter(
    row: number,
    cell: number,
    value: any,
    column: Column,
    dataContext: any,
    grid: SlickGrid
  ) {
    const out = `
      <div class="" style="width:500px"> ${dataContext.__params.note}</div>
     `;
    if (dataContext.__params.note) return out;
    return;
  }
}
