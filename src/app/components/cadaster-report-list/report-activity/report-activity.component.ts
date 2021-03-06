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
import { ReportActivityModel } from 'src/app/models/report-activity.model';
import { ReportCommentModel } from 'src/app/models/report-comment.model';
import { ReportActivityService } from 'src/app/services/report-activity.service';
import { ReportCommentService } from 'src/app/services/report-comment.service';
import { ReportSharedService } from 'src/app/services/report-shared.service';
import { CustomInputEditor } from '../../editors/custom-input-editor/custom-input';
import { CustomInputEditorComponent } from '../../editors/custom-input-editor/custom-input-editor.component';
import { reportCadasterTreeFormatter } from '../../formatters/reportCadasterTreeFormatter';

@Component({
  selector: 'app-report-activity',
  templateUrl: './report-activity.component.html',
  styleUrls: ['./report-activity.component.css'],
})
export class ReportActivityComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: ReportActivityModel[] = [];
  gridObj: any;
  dataViewObj: any;
  cdrReportId!: number;
  isExcludingChildWhenFiltering = false;
  isAutoApproveParentItemWhenTreeColumnIsValid = true;
  commentList: ReportCommentModel[] = [];
  kindId!: number;
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
      if (args.item.__hasChildren || this.statusId > 1) {
        return false;
      }
      return true;
    });
  }

  constructor(
    private angularUtilService: AngularUtilService,
    private reportActivityService: ReportActivityService,
    private sharedDataService: ReportSharedService,
    private translate: TranslateService,
    private commentService: ReportCommentService,
    private activatedRoute: ActivatedRoute,
    private cadasterService: CadasterReportService
  ) {}

  ngOnInit(): void {
    this.prepareGrid();
    this.activatedRoute.params.subscribe((param: Params) => {
      this.cdrReportId = +param['id'];
      this.refreshList(this.cdrReportId);
      this.getCommentList(this.cdrReportId);
    });

    this.cadasterService
      .getCadasterReportById(this.cdrReportId)
      .subscribe((report: any) => {
        const { kindId, statusId } = report;
        this.kindId = kindId;
        this.statusId = statusId;
      });
  }

  getCommentList(cdrReportId: number): void {
    this.commentService
      .getReportCommentList(cdrReportId, 'activity')
      .subscribe((data: any) => (this.commentList = data));
  }

  refreshList(reportId: number) {
    this.reportActivityService
      .getReportActivityById(reportId)
      .subscribe((data) => (this.dataset = data));
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
            discriminator: 'activity',
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
        this.reportActivityService
          .addReportActivity(data)
          .subscribe((res) => this.refreshList(this.cdrReportId));
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
    this.translate.get('CDR_REPORTS.ACTIVITY').subscribe((translations) => {
      const { ACTIVITY_NAME, DIC_UNIT_NAME, COUNT_VOLUME } = translations;

      this.columnDefinitions = [
        {
          id: 'activityName',
          name: ACTIVITY_NAME,
          field: 'activityName',
          type: FieldType.string,
          width: 120,
          formatter: reportCadasterTreeFormatter,
          filterable: true,
          sortable: true,
        },

        {
          id: 'dicUnitName',
          name: DIC_UNIT_NAME,
          field: 'dicUnitName',
          filterable: true,
          sortable: true,
        },

        {
          id: 'countVolume',
          name: COUNT_VOLUME,
          field: 'countVolume',
          filterable: true,
          sortable: true,
          formatter: Formatters.multiple,
          params: {
            formatters: [Formatters.complexObject],
            complexFieldLabel: 'countVolume',
          },
          editor: {
            model: CustomInputEditor,
            params: {
              component: CustomInputEditorComponent,
            },
          },
        },
      ];
    });

    this.gridOptions = {
      enableFiltering: true,
      showPreHeaderPanel: false,
      enableTreeData: true, // you must enable this flag for the filtering & sorting to work as expected
      multiColumnSort: false, // multi-column sorting is not supported with Tree Data, so you need to disable it
      treeDataOptions: {
        columnId: 'activityName',
        childrenPropName: 'children',
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
}
