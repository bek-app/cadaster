import { ReportProductModel } from './../../../models/report-product.model';
import { Component, OnInit } from '@angular/core';
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
import { ReportProductService } from '../../../services/report-product.service';
import { TranslateService } from '@ngx-translate/core';
import { ReportCommentModel } from 'src/app/models/report-comment.model';
import { ReportCommentService } from 'src/app/services/report-comment.service';
import { ReportSharedService } from 'src/app/services/report-shared.service';
import { CustomInputEditor } from '../../editors/custom-input-editor/custom-input';
import { CustomInputEditorComponent } from '../../editors/custom-input-editor/custom-input-editor.component';
import { ActivatedRoute, Params } from '@angular/router';
import { CadasterReportService } from '@services/cadaster-report.service';
@Component({
  selector: 'app-report-product',
  templateUrl: './report-product.component.html',
  styleUrls: ['./report-product.component.css'],
})
export class ReportProductComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: ReportProductModel[] = [];
  gridObj: any;
  dataViewObj: any;
  isExcludingChildWhenFiltering = false;
  isAutoApproveParentItemWhenTreeColumnIsValid = true;
  dicUnitList: any[] = [];
  cdrReportId!: number;
  commentList: any[] = [];
  kindId!: number;
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
    private reportProductService: ReportProductService,
    private translateService: TranslateService,
    private commentService: ReportCommentService,
    private sharedDataService: ReportSharedService,
    private angularUtilService: AngularUtilService,
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
      .subscribe((result: any) => (this.kindId = result.kindId));
  }

  getCommentList(cdrReportId: number): void {
    this.commentService
      .getReportCommentList(this.cdrReportId, 'product')
      .subscribe((data: any) => {
        this.commentList = data;
      });
  }

  refreshList(reportId: number) {
    this.reportProductService
      .getReportProductById(reportId)
      .subscribe((data) => {
        this.dataset = data;
      });
  }

  onCellClicked(e: Event, args: OnEventArgs) {
    const metadata =
      this.angularGrid.gridService.getColumnFromEventArguments(args);
    const { id } = metadata.dataContext;
    const { field } = metadata.columnDef;

    if (field !== 'productName') {
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
            discriminator: 'product',
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
        let valueField = metadata.dataContext[item].toString();

        let discriminator = metadata.dataContext.discriminator;

        const data = {
          id,
          nameField,
          valueField,
        };

        this.reportProductService
          .addReportProduct(data)
          .subscribe((res: any) => {});
      }
    }
  }

  prepareGrid() {
    this.translateService
      .get('CDR_REPORTS.PRODUCT')
      .subscribe((translations: any) => {
        const {
          PRODUCT_NAME,
          PRODUCT_VOLUME,
          UNIT_NAME,
          PRODUCT_CARBON_DIOXIDE,
          PRODUCT_METHANE,
          PRODUCT_NITROUS_OXIDE,
          PRODUCT_PERFLUORO_CARBONS,
          GAS_EMISSION_VOLUME,
        } = translations;
        this.columnDefinitions = [
          {
            id: 'productName',
            name: PRODUCT_NAME,
            field: 'productName',
            filterable: true,
            sortable: true,
          },
          {
            id: 'productVolume',
            name: PRODUCT_VOLUME,
            field: 'productVolume',
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject],
              complexFieldLabel: 'productVolume',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },
          {
            id: 'unitName',
            name: UNIT_NAME,
            field: 'unitName',
            filterable: true,
            sortable: true,
          },
          {
            id: 'productCarbonDioxide',
            name: PRODUCT_CARBON_DIOXIDE,
            field: 'productCarbonDioxide',
            columnGroup: GAS_EMISSION_VOLUME,
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject],
              complexFieldLabel: 'productCarbonDioxide',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },
          {
            id: 'productMethane',
            name: PRODUCT_METHANE,
            field: 'productMethane',
            columnGroup: GAS_EMISSION_VOLUME,
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject],
              complexFieldLabel: 'productMethane',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },
          {
            id: 'productNitrousOxide',
            name: PRODUCT_NITROUS_OXIDE,
            field: 'productNitrousOxide',
            columnGroup: GAS_EMISSION_VOLUME,
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject],
              complexFieldLabel: 'productNitrousOxide',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },

          {
            id: 'productPerfluorocarbons',
            name: PRODUCT_PERFLUORO_CARBONS,
            field: 'productPerfluorocarbons',
            columnGroup: GAS_EMISSION_VOLUME,
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject],
              complexFieldLabel: 'productPerfluorocarbons',
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
      showPreHeaderPanel: true,
      enableFiltering: true,
      params: {
        angularUtilService: this.angularUtilService,
      },
    };
  }
}
