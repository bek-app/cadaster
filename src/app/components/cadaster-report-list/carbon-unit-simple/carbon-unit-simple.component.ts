import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ReportCarbonUnitService } from '@services/report-corbon-unit.service';
import {
  AngularGridInstance,
  AngularUtilService,
  Column,
  Formatter,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ReportCommentModel } from 'src/app/models/report-comment.model';
import { ReportCommentService } from 'src/app/services/report-comment.service';
import { ReportSharedService } from 'src/app/services/report-shared.service';
import { CustomInputEditor } from '../../editors/custom-input-editor/custom-input';
import { CustomInputEditorComponent } from '../../editors/custom-input-editor/custom-input-editor.component';
@Component({
  selector: 'app-carbon-unit-simple',
  templateUrl: './carbon-unit-simple.component.html',
  styleUrls: ['./carbon-unit-simple.component.css'],
})
export class CarbonUnitSimpleComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any;
  gridObj: any;
  dataViewObj: any;
  cdrReportId!: number;
  isExcludingChildWhenFiltering = false;
  isAutoApproveParentItemWhenTreeColumnIsValid = true;
  commentList: ReportCommentModel[] = [];

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
    this.gridObj.onBeforeEditCell.subscribe((e: any, args: any) => {
      if (args.item.discriminator === 'all') {
        return false;
      }
      return true;
    });
  }

  constructor(
    private sharedDataService: ReportSharedService,
    private translate: TranslateService,
    private commentService: ReportCommentService,
    private carbonUnitService: ReportCarbonUnitService,
    private angularUtilService: AngularUtilService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.prepareGrid();
    this.activatedRoute.params.subscribe((param: Params) => {
      this.cdrReportId = +param['id'];
      this.refreshList(this.cdrReportId);
      this.getCommentList(this.cdrReportId);
    });
  }

  getCommentList(cdrReportId: number): void {
    this.commentService
      .getReportCommentList(cdrReportId, 'carbon-unit')
      .subscribe((data: any) => (this.commentList = data));
  }

  refreshList(reportId: number) {
    this.carbonUnitService
      .getReportCarbonUnitSimpleByReportId(reportId)
      .subscribe((data: any) => (this.dataset = data));
  }

  onCellClicked(e: Event, args: OnEventArgs) {
    const metadata =
      this.angularGrid.gridService.getColumnFromEventArguments(args);
    const { id } = metadata.dataContext;
    const { field } = metadata.columnDef;
    if (field !== 'kindName') {
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
            discriminator: 'carbon-unit',
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
          id: this.cdrReportId,
          nameField,
          valueField: valueField.toString(),
          discriminator,
        };

        this.carbonUnitService.addReportCarbonUnit(data).subscribe((res) => {
          this.refreshList(this.cdrReportId);
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
    this.translate.get('CDR_REPORTS.CARBON_UNIT').subscribe((translations) => {
      const {
        TYPE_CARBON_UNIT,
        RECEIVED_GROUP,
        RECEIVED_FREE,
        RECEIVED_SALE,
        BALANCE,
        ADDITIONAL_PLAN,
        ACQUIRED,
        ACQUIRED_PLAN,
        PLANNING_OFFSET,
        ALIENATED,
        ALIENATED_PLAN,
        TRANSFERRED,
        TRANSFERRED_PLAN,
      } = translations;

      this.columnDefinitions = [
        {
          id: 'kindName',
          name: TYPE_CARBON_UNIT,
          field: 'kindName',
          filterable: true,
        },

        {
          id: 'receivedFree',
          name: RECEIVED_FREE,
          field: 'receivedFree',
          columnGroup: RECEIVED_GROUP,
          filterable: true,
          sortable: true,
          formatter: Formatters.multiple,
          params: {
            formatters: [this.commentFormatter],
          },
          editor: {
            model: CustomInputEditor,
            params: {
              component: CustomInputEditorComponent,
            },
          },
        },

        {
          id: 'receivedSale',
          name: RECEIVED_SALE,
          field: 'receivedSale',
          columnGroup: RECEIVED_GROUP,
          filterable: true,
          sortable: true,
          formatter: Formatters.multiple,
          params: {
            formatters: [this.commentFormatter],
          },
          editor: {
            model: CustomInputEditor,
            params: {
              component: CustomInputEditorComponent,
            },
          },
        },

        {
          id: 'balance',
          name: BALANCE,
          field: 'balance',
          filterable: true,
          sortable: true,
          formatter: Formatters.multiple,
          params: {
            formatters: [this.commentFormatter],
            complexFieldLabel: '',
          },
          editor: {
            model: CustomInputEditor,
            params: {
              component: CustomInputEditorComponent,
            },
          },
        },
        {
          id: 'additionalPlan',
          name: ADDITIONAL_PLAN,
          field: 'additionalPlan',
          filterable: true,
          sortable: true,
          formatter: Formatters.multiple,
          params: {
            formatters: [this.commentFormatter],
            complexFieldLabel: '',
          },
          editor: {
            model: CustomInputEditor,
            params: {
              component: CustomInputEditorComponent,
            },
          },
        },
        {
          id: 'acquired',
          name: ACQUIRED,
          field: 'acquired',
          filterable: true,
          sortable: true,
          formatter: Formatters.multiple,
          params: {
            formatters: [this.commentFormatter],
            complexFieldLabel: '',
          },
          editor: {
            model: CustomInputEditor,
            params: {
              component: CustomInputEditorComponent,
            },
          },
        },
        {
          id: 'acquiredPlan',
          name: ACQUIRED_PLAN,
          field: 'acquiredPlan',
          filterable: true,
          sortable: true,
          formatter: Formatters.multiple,
          params: {
            formatters: [this.commentFormatter],
            complexFieldLabel: '',
          },
          editor: {
            model: CustomInputEditor,
            params: {
              component: CustomInputEditorComponent,
            },
          },
        },
        {
          id: 'planingOffset',
          name: PLANNING_OFFSET,
          field: 'planingOffset',
          filterable: true,
          sortable: true,
          formatter: Formatters.multiple,
          params: {
            formatters: [this.commentFormatter],
            complexFieldLabel: '',
          },
          editor: {
            model: CustomInputEditor,
            params: {
              component: CustomInputEditorComponent,
            },
          },
        },
        {
          id: 'alienated',
          name: ALIENATED,
          field: 'alienated',
          filterable: true,
          sortable: true,
          formatter: Formatters.multiple,
          params: {
            formatters: [this.commentFormatter],
            complexFieldLabel: '',
          },
          editor: {
            model: CustomInputEditor,
            params: {
              component: CustomInputEditorComponent,
            },
          },
        },
        {
          id: 'alienatedPlan',
          name: ALIENATED_PLAN,
          field: 'alienatedPlan',
          filterable: true,
          sortable: true,
          formatter: Formatters.multiple,
          params: {
            formatters: [this.commentFormatter],
            complexFieldLabel: '',
          },
          editor: {
            model: CustomInputEditor,
            params: {
              component: CustomInputEditorComponent,
            },
          },
        },
        {
          id: 'transferred',
          name: TRANSFERRED,
          field: 'transferred',
          filterable: true,
          sortable: true,
          formatter: Formatters.multiple,
          params: {
            formatters: [this.commentFormatter],
            complexFieldLabel: '',
          },
          editor: {
            model: CustomInputEditor,
            params: {
              component: CustomInputEditorComponent,
            },
          },
        },
        {
          id: 'transferredPlan',
          name: TRANSFERRED_PLAN,
          field: 'transferredPlan',
          filterable: true,
          sortable: true,
          formatter: Formatters.multiple,
          params: {
            formatters: [this.commentFormatter],
            complexFieldLabel: '',
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
      enableFiltering: false,
      showPreHeaderPanel: true,
      params: {
        angularUtilService: this.angularUtilService, // provide the service to all at once (Editor, Filter, AsyncPostRender)
      },
    };
  }
}
