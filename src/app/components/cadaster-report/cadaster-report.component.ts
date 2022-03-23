import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AngularGridInstance,
  Column,
  FieldType,
  Formatter,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { CadasterReportModel } from 'src/app/models/cadaster-report.model';
import { CadasterReportService } from 'src/app/services/cadaster-report.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../confirm-dialog/confirm-dialog.component';
import { CadasterReportFormComponent } from './cadaster-report-form/cadaster-report-form.component';
@Component({
  selector: 'app-cadaster-report',
  templateUrl: './cadaster-report.component.html',
  styleUrls: ['./cadaster-report.component.css'],
})
export class CadasterReportComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: CadasterReportModel[] = [];
  cdrReportId!: number;
  gridObj: any;
  dataViewObj: any;
  modalRef: any;
  statusId!: number;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }
  constructor(
    private dialog: MatDialog,
    private cadasterService: CadasterReportService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.prepareGrid();
    this.refreshList();
  }

  refreshList() {
    this.cadasterService.getCadasterReportList(0).subscribe((data) => {
      this.dataset = data;
    });
  }

  openCdrReportDialog() {
    this.modalRef = this.dialog.open(CadasterReportFormComponent, {
      width: '850px',
    });
    this.addCdrReport();
    this.updateCdrReport();
  }

  addCdrReport() {
    this.modalRef.componentInstance.addCdrReport.subscribe((data: any) => {
      this.cadasterService
        .addCadasterReport({ id: 0, ...data })
        .subscribe((result) => this.refreshList());
      this.modalRef.close();
    });
  }

  updateCdrReport() {
    this.modalRef.componentInstance.updateCdrReport.subscribe((data: any) => {
      const newData = { id: this.cdrReportId, ...data };
      console.log(newData);

      this.cadasterService
        .updateCadasterReport(newData)
        .subscribe((result) => this.refreshList());
      this.modalRef.close();
    });
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.cdrReportId = item.id;
  }

  prepareGrid() {
    this.translate.get('CDR_REPORT.FORM').subscribe((translations: any) => {
      const {
        NAME_PLANT,
        OBLAST,
        REGION,
        ADDRESS,
        REPORT_YEAR,
        REG_NUMBER,
        KIND,
        VALIDATION,
        STATUS_NAME,
      }: any = translations;

      this.columnDefinitions = [
        {
          id: 'regNumber',
          name: REG_NUMBER,
          field: 'regNumber',
          filterable: true,
          sortable: true,
        },

        {
          id: 'namePlant',
          name: NAME_PLANT,
          field: 'namePlant',
          filterable: true,
          sortable: true,
        },
        {
          id: 'reportYear',
          name: REPORT_YEAR,
          field: 'reportYear',
          filterable: true,
          sortable: true,
          width: 40,
        },

        {
          id: 'validatorName',
          name: VALIDATION,
          field: 'validatorName',
          filterable: true,
          sortable: true,
        },

        {
          id: 'address',
          name: ADDRESS,
          field: 'address',
          filterable: true,
          sortable: true,
        },
        {
          id: 'kindName',
          name: KIND,
          field: 'kindName',
          filterable: true,
          sortable: true,
        },
        {
          id: 'statusName',
          name: STATUS_NAME,
          field: 'statusName',
          filterable: true,
          sortable: true,
        },
        {
          id: 'view',
          field: 'id',
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
          minWidth: 30,
          maxWidth: 30,
          formatter: () =>
            `<span class="mdi mdi-loupe" style="cursor:pointer;"></span>`,
          onCellClick: (e: Event, args: OnEventArgs) => {
            this.openCdrReportDialog();
            this.modalRef.componentInstance.editForm(this.cdrReportId);
            this.modalRef.componentInstance.form.disable();
            this.modalRef.componentInstance.viewMode = true;
          },
        },

        {
          id: 'action',
          field: 'action',
          minWidth: 30,
          maxWidth: 30,
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
          formatter: () => `<i class="fa fa-cog" style="cursor:pointer;"></i>`,
          onCellClick: (e: Event, args: OnEventArgs) => {
            const id = args.dataContext.id;
            this.router.navigate(['../cadaster-report-list', id], {
              relativeTo: this.route,
            });
          },
        },
        {
          id: 'edit',
          field: 'id',
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
          formatter: myCustomEditFormatter,
          minWidth: 30,
          maxWidth: 30,
          onCellClick: (e: Event, args: OnEventArgs) => {
            if (args.dataContext.statusId <= 1) {
              this.openCdrReportDialog();
              this.modalRef.componentInstance.editForm(this.cdrReportId);
            }
          },
        },
        {
          id: 'delete',
          field: 'id',
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
          formatter: myCustomDeleteFormatter,
          minWidth: 30,
          maxWidth: 30,
          onCellClick: (e: Event, args: OnEventArgs) => {
            if (args.dataContext.statusId <= 1) {
              const id = args.dataContext.id;
              const dialogData = new ConfirmDialogModel(
                'Подтвердить действие',
                'Вы уверены, что хотите удалить это?'
              );
              const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                maxWidth: '400px',
                data: dialogData,
              });
              dialogRef.afterClosed().subscribe((dialogResult) => {
                if (dialogResult) {
                  this.cadasterService
                    .deleteCadasterReport(id)
                    .subscribe(() => {
                      this.refreshList();
                    });
                }
              });
            }
          },
        },
      ];
    });

    this.gridOptions = {};
  }
}
 
const myCustomEditFormatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: Column,
  dataContext: any,
  grid?: any
) =>
  dataContext.statusId > 1
    ? `<i style="display: none;"></i>`
    : '<i class="fa fa-pencil pointer edit-icon"></i>';

const myCustomDeleteFormatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: Column,
  dataContext: any,
  grid?: any
) =>
  dataContext.statusId > 1
    ? `<i style="display: none;"></i>`
    : '<i class="fa fa-trash pointer delete-icon"></i>';
