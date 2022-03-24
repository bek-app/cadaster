import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CadasterReportService } from '@services/cadaster-report.service';
import {
  AngularGridInstance,
  AngularUtilService,
  Column,
  FieldType,
  Formatter,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ReportCommentModel } from 'src/app/models/report-comment.model';
import { ReportCommentService } from 'src/app/services/report-comment.service';
import { ReportSharedService } from 'src/app/services/report-shared.service';
import { ActualEmissionService } from '../../../services/actual-emission.service';
import { CustomInputEditor } from '../../editors/custom-input-editor/custom-input';
import { CustomInputEditorComponent } from '../../editors/custom-input-editor/custom-input-editor.component';
import { reportCadasterTreeFormatter } from '../../formatters/reportCadasterTreeFormatter';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NotificationService } from '@services/notification.service';
@Component({
  selector: 'app-report-actual-emission',
  templateUrl: './report-actual-emission.component.html',
  styleUrls: ['./report-actual-emission.component.css'],
})
export class ReportActualEmissionComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  gridObj: any;
  dataViewObj: any;
  cdrReportId!: number;
  isExcludingChildWhenFiltering = false;
  isAutoApproveParentItemWhenTreeColumnIsValid = true;
  commentList: ReportCommentModel[] = [];
  statusId!: number;
  form: FormGroup;

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
      if (args.item.__hasChildren || this.statusId > 1) {
        return false;
      }
      return true;
    });
  }

  constructor(
    private angularUtilService: AngularUtilService,
    private actualEmissionService: ActualEmissionService,
    private sharedDataService: ReportSharedService,
    private translate: TranslateService,
    private commentService: ReportCommentService,
    private cdrReportService: CadasterReportService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      totalTon: new FormControl(),
      totalCo2: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.prepareGrid();
    this.route.params.subscribe((param: Params) => {
      this.cdrReportId = +param['id'];
      this.refreshList(this.cdrReportId);
      this.getCommentList(this.cdrReportId);
    });

    if (this.statusId > 1) {
      this.form.disable();
    }

    this.cdrReportService
      .getCadasterReportById(this.cdrReportId)
      .subscribe((report: any) => {
        const { statusId, totalTon, totalCo2 } = report;
        this.statusId = statusId;
        this.form.patchValue({ totalTon, totalCo2 }, { emitEvent: false });
      });

    this.form.controls.totalTon.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        const data = {
          id: this.cdrReportId,
          discriminator: 'actual-emission',
          nameField: 'TotalTon',
          valueField: value.toString(),
        };

        this.cdrReportService
          .updateFieldCadasterReport(data)
          .subscribe(() =>
            this.notificationService.success('Успешно добавлен')
          );
      });

    this.form.controls.totalCo2.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        const data = {
          id: this.cdrReportId,
          discriminator: 'actual-emission',
          nameField: 'TotalCo2',
          valueField: value.toString(),
        };

        this.cdrReportService
          .updateFieldCadasterReport(data)
          .subscribe(() =>
            this.notificationService.success('Успешно добавлен')
          );
      });
  }

  getCommentList(cdrReportId: number): void {
    this.commentService
      .getReportCommentList(cdrReportId, 'actual')
      .subscribe((data: any) => {
        this.commentList = data;
      });
  }

  refreshList(reportId: number) {
    this.actualEmissionService
      .getActualEmissionById(reportId)
      .subscribe((data) => {
        let group: any[] = [];
        data.forEach((items) => {
          items.processes.forEach((process: any) => {
            Object.assign(process, {
              processName: process.dicMaterialName,
            });
          });
          items.materials.forEach((material: any) => {
            Object.assign(material, {
              processName: material.dicMaterialName,
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
            discriminator: 'actual',
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
        let discriminator = metadata.dataContext.discriminator;
        if (typeof valueField === 'object') {
          return;
        }

        const data = {
          id,
          nameField,
          valueField: valueField.toString(),
          discriminator,
        };

        this.actualEmissionService
          .addActualEmission(data)
          .subscribe((result) => {
            const { totalCo2, totalTon } = result;
            this.angularGrid.gridService.addItem(
              {
                ...metadata.dataContext,
                totalCo2,
                totalTon,
              },
              {
                highlightRow: false,
                selectRow: true,
                triggerEvent: true,
              }
            );
          });
      }
    }
  }

  commentFormatter: Formatter = (
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

  prepareGrid() {
    this.translate
      .get('CDR_REPORTS.ACTUAL_EMISSION')
      .subscribe((translations) => {
        const {
          PROCESS_NAME,
          CARBON_DIOXIDE,
          METHAN_EMISSION_TON,
          MATHAN_EMISSION_CO2,
          METHAN_COLUMN_GROUP,
          NITROUS_OXIDE_TON,
          NITROUS_OXIDE_CO2,
          NITROUS_COLUMN_GROUP,
          PERFLUORO_CARBON_TON,
          PERFLUORO_CARBON_CO2,
          PERFLUORO_CARBON_COLUMN_GROUP,
          TOTAL_CO2,
          TOTAL_TON,
          TOTAL_GROUP,
        } = translations;

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
            id: 'carbonDioxide',
            name: CARBON_DIOXIDE,
            field: 'carbonDioxide',
            filterable: true,
            sortable: true,
            minWidth: 200,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject, this.commentFormatter],
              complexFieldLabel: 'carbonDioxide',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },

          {
            id: 'methaneEmissionsTon',
            name: METHAN_EMISSION_TON,
            field: 'methaneEmissionsTon',
            columnGroup: METHAN_COLUMN_GROUP,
            filterable: true,
            sortable: true,
            minWidth: 200,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject],
              complexFieldLabel: 'methaneEmissionsTon',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },

          {
            id: 'methaneEmissionsCo2',
            name: MATHAN_EMISSION_CO2,
            field: 'methaneEmissionsCo2',
            columnGroup: METHAN_COLUMN_GROUP,
            filterable: true,
            sortable: true,
            minWidth: 200,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject],
              complexFieldLabel: 'methaneEmissionsCo2',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },

          {
            id: 'nitrousOxideTon',
            name: NITROUS_OXIDE_TON,
            field: 'nitrousOxideTon',
            columnGroup: NITROUS_COLUMN_GROUP,
            filterable: true,
            sortable: true,
            minWidth: 200,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject],
              complexFieldLabel: 'nitrousOxideTon',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },
          {
            id: 'nitrousOxideCo2',
            name: NITROUS_OXIDE_CO2,
            field: 'nitrousOxideCo2',
            columnGroup: NITROUS_COLUMN_GROUP,
            filterable: true,
            sortable: true,
            minWidth: 200,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject],
              complexFieldLabel: 'nitrousOxideCo2',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },
          {
            id: 'perfluorocarbonTon',
            name: PERFLUORO_CARBON_TON,
            field: 'perfluorocarbonTon',
            columnGroup: PERFLUORO_CARBON_COLUMN_GROUP,
            filterable: true,
            sortable: true,
            minWidth: 200,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject],
              complexFieldLabel: 'perfluorocarbonTon',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },
          {
            id: 'perfluorocarbonCo2',
            name: PERFLUORO_CARBON_CO2,
            field: 'perfluorocarbonCo2',
            columnGroup: PERFLUORO_CARBON_COLUMN_GROUP,

            filterable: true,
            sortable: true,
            minWidth: 200,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject],
              complexFieldLabel: 'perfluorocarbonCo2',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },
          // {
          //   id: 'totalTon',
          //   name: TOTAL_TON,
          //   field: 'totalTon',
          //   columnGroup: TOTAL_GROUP,
          //   filterable: true,
          //   sortable: true,
          //   minWidth: 250,
          // },
          // {
          //   id: 'totalCo2',
          //   name: TOTAL_CO2,
          //   field: 'totalCo2',
          //   columnGroup: TOTAL_GROUP,
          //   filterable: true,
          //   sortable: true,
          //   minWidth: 250,
          // },
        ];
      });

    this.gridOptions = {
      enableFiltering: true,
      showPreHeaderPanel: true,
      enableTreeData: true, // you must enable this flag for the filtering & sorting to work as expected
      multiColumnSort: false, // multi-column sorting is not supported with Tree Data, so you need to disable it
      treeDataOptions: {
        columnId: 'processName',
        childrenPropName: 'group',
        excludeChildrenWhenFilteringTree: this.isExcludingChildWhenFiltering,
        autoApproveParentItemWhenTreeColumnIsValid:
          this.isAutoApproveParentItemWhenTreeColumnIsValid,
      },
      params: {
        angularUtilService: this.angularUtilService, // provide the service to all at once (Editor, Filter, AsyncPostRender)
      },

      presets: {
        treeData: { toggledItems: [{ itemId: 1, isCollapsed: true }] },
      },
    };
  }
}
