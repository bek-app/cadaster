import { Component, OnInit } from '@angular/core';
import {
  AngularGridInstance,
  AngularUtilService,
  Column,
  FieldType,
  Formatters,
  Formatter,
  GridOption,
  OnEventArgs,
  SlickGrid,
} from 'angular-slickgrid';
import { ParameterCalc } from 'src/app/models/parameter-calc.model';
import { ParameterCalcService } from 'src/app/services/parameter-calc.service';
import { ActivatedRoute, Params } from '@angular/router';
import { CustomSelectEditor } from '../../editors/custom-select-editor/custom-select';
import { CustomSelectEditorComponent } from '../../editors/custom-select-editor/custom-select-editor.component';
import { reportCadasterTreeFormatter } from '../../formatters/reportCadasterTreeFormatter';
import { MatDialog } from '@angular/material/dialog';
import { ReportCommentService } from 'src/app/services/report-comment.service';
import { ReportCommentModel } from 'src/app/models/report-comment.model';
import { NotificationService } from 'src/app/services/notification.service';
import { CustomInputEditorComponent } from '../../editors/custom-input-editor/custom-input-editor.component';
import { CustomInputEditor } from '../../editors/custom-input-editor/custom-input';
import { ReportSharedService } from 'src/app/services/report-shared.service';
import { TranslateService } from '@ngx-translate/core';
import { CadasterReportService } from '@services/cadaster-report.service';

@Component({
  selector: 'app-report-parameter-calc',
  templateUrl: './report-parameter-calc.component.html',
  styleUrls: ['./report-parameter-calc.component.css'],
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
  statusId!: number;

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;

    this.dataViewObj.getItemMetadata = (row: any) => {
      const newCssClass = 'inactive__header';
      const materialClass = 'sub__header-material';
      const processClass = 'sub__header-process';

      const item = this.dataViewObj.getItem(row);

      if (item.__hasChildren && item.__treeLevel === 0) {
        return {
          cssClasses: newCssClass,
        };
      } else if (item.key == 'material') {
        return {
          cssClasses: materialClass,
        };
      } else if (item.key == 'processes') {
        return {
          cssClasses: processClass,
        };
      } else return '';
    };

    this.gridObj.onBeforeEditCell.subscribe((e: any, args: any) => {
      if (!args.item.__hasChildren || this.statusId > 1) {
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
    private notificationService: NotificationService,
    private sharedDataService: ReportSharedService,
    private translate: TranslateService,
    private cdrReportService: CadasterReportService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      (res: any) => (this.dicUnitList = res.dicUnit)
    );

    this.prepareGrid();
    this.activatedRoute.params.subscribe((param: Params) => {
      this.cdrReportId = +param['id'];

      this.refreshList(this.cdrReportId);
      this.getCommentList(this.cdrReportId);
    });

    this.cdrReportService
      .getCadasterReportById(this.cdrReportId)
      .subscribe((report: any) => {
        const { statusId } = report;
        this.statusId = statusId;
      });
  }

  getCommentList(cdrReportId: number): void {
    this.commentService
      .getReportCommentList(cdrReportId, 'calc')
      .subscribe((data: any) => (this.commentList = data));
  }

  parameterCalcFormatter: Formatter = (
    row: number,
    cell: number,
    value: any,
    columnDef: Column,
    dataContext: any,
    grid?: any
  ) => {
    const { id } = dataContext;
    const { field } = columnDef;

    const res = this.commentList.find((comment) => {
      return comment.recordId === id.toString() && comment.controlId === field;
    });

    return {
      addClasses: res ? 'border' : '',
      text: value ? value : '',
    };
  };

  refreshList(reportId: number) {
    this.parameterCalcService
      .getParameterCalcById(reportId)
      .subscribe((data) => {
        let group: any[] = [];
        data.forEach((items) => {
          items.processes.forEach((process: any) => {
            Object.assign(process, {
              processName: process.dicMaterialName,
              q3Unit: {
                id: process.q3UnitId,
                name: process.q3UnitName,
              },
              q4Unit: {
                id: process.q4UnitId,
                name: process.q4UnitName,
              },
              slagCarbonUnit: {
                id: process.slagCarbonUnitId,
                name: process.slagCarbonUnitName,
              },
              slagAmountUnit: {
                id: process.slagAmountUnitId,
                name: process.slagAmountUnitName,
              },
              paramCalcUnit: {
                id: process.paramCalcUnitId,
                name: process.paramCalcUnitName,
              },
            });
          });

          items.materials.forEach((material: any) => {
            Object.assign(material, {
              processName: material.dicMaterialName,

              q3Unit: {
                id: material.q3UnitId,
                name: material.q3UnitName,
              },
              q4Unit: {
                id: material.q4UnitId,
                name: material.q4UnitName,
              },
              slagCarbonUnit: {
                id: material.slagCarbonUnitId,
                name: material.slagCarbonUnitName,
              },
              slagAmountUnit: {
                id: material.slagAmountUnitId,
                name: material.slagAmountUnitName,
              },
              paramCalcUnit: {
                id: material.paramCalcUnitId,
                name: material.paramCalcUnitName,
              },
            });
          });

          group = [
            {
              id: '_' + Math.random().toString(36),
              processName: 'Сырье',
              group: [...items.materials],
              key: 'material',
            },
            {
              id: '_' + Math.random().toString(36),
              processName: 'Подпроцессы',
              group: [...items.processes],
              key: 'processes',
            },
          ].sort((a, b) => (a.processName < b.processName ? 1 : -1));
          Object.assign(items, { group });
        });

        this.dataset = data;
      });
  }

  onCellClicked(e: Event, args: OnEventArgs) {
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

          this.sharedDataService.sendComment(comment);
        }
      }
    }
  }

  onCellChanged(e: Event, args: OnEventArgs) {
    const metadata =
      this.angularGrid.gridService.getColumnFromEventArguments(args);

    const { id } = metadata.dataContext;
    const { field } = metadata.columnDef;

    for (let item in metadata.dataContext) {
      if (field === item) {
        let nameField = item[0].toUpperCase() + item.slice(1);
        let valueField = metadata.dataContext[item];
        let newValueField;
        let discriminator = metadata.dataContext.discriminator;

        if (typeof valueField === 'object') {
          return;
        } else newValueField = valueField.toString();

        const data = {
          id,
          nameField,
          valueField: newValueField,
          discriminator,
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
          });
      }
    }
  }

  prepareGrid() {
    this.translate
      .get('CDR_REPORTS.PARAMETER_CALC')
      .subscribe((translations: string) => {
        const {
          PROCESS_NAME,
          Q4,
          Q3,
          VARIANT_A,
          SLAG_CARBON,
          VARIANT_B,
          DIC_UNIT,
          SLAG_AMOUNT,
          FUEL_CONSUMPTION,
        }: any = translations;

        this.columnDefinitions = [
          {
            id: 'processName',
            name: PROCESS_NAME,
            field: 'processName',
            type: FieldType.string,
            minWidth: 600,
            formatter: reportCadasterTreeFormatter,
            filterable: true,
            sortable: true,
          },

          {
            id: 'q4',
            name: Q4,
            field: 'q4',
            columnGroup: VARIANT_A,
            formatter: Formatters.multiple,
            params: {
              formatters: [
                this.parameterCalcFormatter,
                Formatters.complexObject,
              ],
              complexFieldLabel: 'q4',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
            exportWithFormatter: true,
            filterable: true,
            sortable: true,
            minWidth: 300,
            customTooltip: {
              position: 'right-align',
              formatter: () =>
                `<div><span class="fa fa-spinner fa-pulse fa-fw"></span> loading...</div>`,
              asyncProcess: (
                row: number,
                cell: number,
                value: any,
                column: Column,
                dataContext: any
              ) => {
                const id = dataContext.id.toString();
                let item = this.commentList.find(
                  (comment: any) =>
                    comment.recordId === id && comment.controlId === 'q4'
                );
                return new Promise((resolve, reject) => {
                  item?.note ? resolve(item) : resolve({});
                });
              },
              asyncPostFormatter: this.tooltipTaskAsyncFormatter as Formatter,
            },
          },

          {
            id: 'q4Unit',
            name: DIC_UNIT,
            field: 'q4Unit',
            columnGroup: VARIANT_A,
            filterable: true,
            sortable: true,
            minWidth: 300,
            formatter: Formatters.complexObject,
            params: {
              complexFieldLabel: 'q4Unit.name',
            },
            editor: {
              model: CustomSelectEditor,
              collection: this.dicUnitList,
              params: {
                component: CustomSelectEditorComponent,
              },
            },
            exportWithFormatter: true,
            onCellChange: (e: Event, args: OnEventArgs) => {
              const id = args.dataContext.id;
              const dicUnit = args.dataContext.q4Unit;
              let discriminator = args.dataContext.discriminator;

              const data = {
                id,
                nameField: 'Q4UnitId',
                valueField:
                  dicUnit.id != null ? dicUnit.id.toString() : dicUnit.id,
                discriminator,
              };

              this.parameterCalcService.addParameterCalc(data).subscribe(
                (result) => {
                  console.log(result);

                  result.isSuccess
                    ? this.notificationService.success(
                        '“Ваши данные сохранены”',
                        'Done'
                      )
                    : this.notificationService.error(
                        `${result.message}`,
                        'Done'
                      );
                },
                (error) => {
                  console.log(error);
                }
              );
            },
          },
          {
            id: 'q3',
            name: Q3,
            field: 'q3',
            columnGroup: VARIANT_A,
            filterable: true,
            sortable: true,
            minWidth: 300,
            formatter: Formatters.multiple,
            params: {
              formatters: [
                this.parameterCalcFormatter,
                Formatters.complexObject,
              ],
              complexFieldLabel: 'q3',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
            customTooltip: {
              position: 'right-align',
              formatter: () =>
                `<div><span class="fa fa-spinner fa-pulse fa-fw"></span> loading...</div>`,
              asyncProcess: (
                row: number,
                cell: number,
                value: any,
                column: Column,
                dataContext: any
              ) => {
                const id = dataContext.id.toString();
                let item = this.commentList.find(
                  (comment: any) =>
                    comment.recordId === id && comment.controlId === 'q3'
                );
                return new Promise((resolve, reject) => {
                  item?.note ? resolve(item) : resolve({});
                });
              },
              asyncPostFormatter: this.tooltipTaskAsyncFormatter as Formatter,
            },
          },
          {
            id: 'q3Unit',
            name: DIC_UNIT,
            field: 'q3Unit',
            columnGroup: VARIANT_A,
            filterable: true,
            sortable: true,
            minWidth: 300,
            formatter: Formatters.complexObject,
            params: {
              complexFieldLabel: 'q3Unit.name',
            },
            editor: {
              model: CustomSelectEditor,
              collection: this.dicUnitList,
              params: {
                component: CustomSelectEditorComponent,
              },
            },
            exportWithFormatter: true,
            onCellChange: (e: Event, args: OnEventArgs) => {
              const id = args.dataContext.id;
              const dicUnit = args.dataContext.q3Unit;
              let discriminator = args.dataContext.discriminator;

              const data = {
                id,
                nameField: 'Q3UnitId',
                valueField:
                  dicUnit.id != null ? dicUnit.id.toString() : dicUnit.id,
                discriminator,
              };

              this.parameterCalcService
                .addParameterCalc(data)
                .subscribe((result) => {
                  result.isSuccess
                    ? this.notificationService.success(
                        '“Ваши данные сохранены”',
                        'Done'
                      )
                    : this.notificationService.error(
                        `${result.message}`,
                        'Done'
                      );
                });
            },
          },

          {
            id: 'slagCarbon',
            name: SLAG_CARBON,
            field: 'slagCarbon',
            columnGroup: VARIANT_A,
            filterable: true,
            sortable: true,
            minWidth: 300,
            formatter: Formatters.multiple,
            params: {
              formatters: [
                this.parameterCalcFormatter,
                Formatters.complexObject,
              ],
              complexFieldLabel: 'slagCarbon',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
            customTooltip: {
              position: 'right-align',
              formatter: () =>
                `<div><span class="fa fa-spinner fa-pulse fa-fw"></span> loading...</div>`,
              asyncProcess: (
                row: number,
                cell: number,
                value: any,
                column: Column,
                dataContext: any
              ) => {
                const id = dataContext.id.toString();
                let item = this.commentList.find(
                  (comment: any) =>
                    comment.recordId === id && comment.controlId === 'q3'
                );
                return new Promise((resolve, reject) => {
                  item?.note ? resolve(item) : resolve({});
                });
              },
              asyncPostFormatter: this.tooltipTaskAsyncFormatter as Formatter,
            },
          },

          {
            id: 'slagCarbonUnit',
            name: DIC_UNIT,
            field: 'slagCarbonUnit',
            columnGroup: 'Вариант Б',
            filterable: true,
            sortable: true,
            minWidth: 300,
            formatter: Formatters.complexObject,
            params: {
              complexFieldLabel: 'slagCarbonUnit.name',
            },
            editor: {
              model: CustomSelectEditor,
              collection: this.dicUnitList,
              params: {
                component: CustomSelectEditorComponent,
              },
            },
            exportWithFormatter: true,
            onCellChange: (e: Event, args: OnEventArgs) => {
              const id = args.dataContext.id;
              const dicUnit = args.dataContext.slagCarbonUnit;
              let discriminator = args.dataContext.discriminator;

              const data = {
                id,
                nameField: 'SlagCarbonUnitId',
                valueField:
                  dicUnit.id != null ? dicUnit.id.toString() : dicUnit.id,
                discriminator,
              };

              this.parameterCalcService
                .addParameterCalc(data)
                .subscribe((result) => {
                  result.isSuccess
                    ? this.notificationService.success(
                        '“Ваши данные сохранены”',
                        'Done'
                      )
                    : this.notificationService.error(
                        `${result.message}`,
                        'Done'
                      );
                });
            },
          },

          {
            id: 'slagAmount',
            name: SLAG_AMOUNT,
            field: 'slagAmount',
            columnGroup: VARIANT_B,
            filterable: true,
            sortable: true,
            minWidth: 300,
            formatter: Formatters.multiple,
            params: {
              formatters: [
                this.parameterCalcFormatter,
                Formatters.complexObject,
              ],
              complexFieldLabel: 'slagAmount',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },
          {
            id: 'slagAmountUnit',
            name: DIC_UNIT,
            field: 'slagAmountUnit',
            columnGroup: 'Вариант Б',
            filterable: true,
            sortable: true,
            minWidth: 300,
            formatter: Formatters.complexObject,
            params: {
              complexFieldLabel: 'slagAmountUnit.name',
            },
            editor: {
              model: CustomSelectEditor,
              collection: this.dicUnitList,
              params: {
                component: CustomSelectEditorComponent,
              },
            },
            exportWithFormatter: true,
            onCellChange: (e: Event, args: OnEventArgs) => {
              const id = args.dataContext.id;
              const dicUnit = args.dataContext.slagAmountUnit;
              let discriminator = args.dataContext.discriminator;

              const data = {
                id,
                nameField: 'SlagAmountUnitId',
                valueField:
                  dicUnit.id != null ? dicUnit.id.toString() : dicUnit.id,
                discriminator,
              };

              this.parameterCalcService
                .addParameterCalc(data)
                .subscribe((result) => {
                  result.isSuccess
                    ? this.notificationService.success(
                        '“Ваши данные сохранены”',
                        'Done'
                      )
                    : this.notificationService.error(
                        `${result.message}`,
                        'Done'
                      );
                });
            },
          },
          {
            id: 'fuelConsumption',
            name: FUEL_CONSUMPTION,
            field: 'fuelConsumption',
            columnGroup: VARIANT_B,
            filterable: true,
            sortable: true,
            minWidth: 300,
            formatter: Formatters.multiple,
            params: {
              formatters: [
                this.parameterCalcFormatter,
                Formatters.complexObject,
              ],
              complexFieldLabel: 'fuelConsumption',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },
          {
            id: 'paramCalcUnit',
            name: DIC_UNIT,
            field: 'paramCalcUnit',
            columnGroup: 'Вариант Б',
            filterable: true,
            sortable: true,
            minWidth: 300,
            formatter: Formatters.complexObject,
            params: {
              complexFieldLabel: 'paramCalcUnit.name',
            },
            editor: {
              model: CustomSelectEditor,
              collection: this.dicUnitList,
              params: {
                component: CustomSelectEditorComponent,
              },
            },
            exportWithFormatter: true,
            onCellChange: (e: Event, args: OnEventArgs) => {
              const id = args.dataContext.id;
              const dicUnit = args.dataContext.paramCalcUnit;
              let discriminator = args.dataContext.discriminator;

              const data = {
                id,
                nameField: 'ParamCalcUnitId',
                valueField:
                  dicUnit.id != null ? dicUnit.id.toString() : dicUnit.id,
                discriminator,
              };

              this.parameterCalcService
                .addParameterCalc(data)
                .subscribe((result) => {
                  result.isSuccess
                    ? this.notificationService.success(
                        '“Ваши данные сохранены”',
                        'Done'
                      )
                    : this.notificationService.error(
                        `${result.message}`,
                        'Done'
                      );
                });
            },
          },
        ];
      });
    this.gridOptions = {
      // gridHeight: '80vh',
      enableFiltering: true,
      showPreHeaderPanel: true,
      enableTreeData: true, // you must enable this flag for the filtering & sorting to work as expected
      multiColumnSort: false, // multi-column sorting is not supported with Tree Data, so you need to disable it
      treeDataOptions: {
        columnId: 'processName',
        childrenPropName: 'group',
        excludeChildrenWhenFilteringTree: this.isExcludingChildWhenFiltering, // defaults to false
        autoApproveParentItemWhenTreeColumnIsValid:
          this.isAutoApproveParentItemWhenTreeColumnIsValid,
      },
      params: {
        angularUtilService: this.angularUtilService, // provide the service to all at once (Editor, Filter, AsyncPostRender)
      },
      presets: {
        treeData: { toggledItems: [{ itemId: 4, isCollapsed: true }] },
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
