import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import {
  AngularGridInstance,
  Column,
  FieldType,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid'
import { CadasterReportModel } from 'src/app/models/cadaster-report.model'
import { CadasterReportService } from 'src/app/services/cadaster-report.service'
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../confirm-dialog/confirm-dialog.component'
import { CadasterReportFormComponent } from './cadaster-report-form/cadaster-report-form.component'
@Component({
  selector: 'app-cadaster-report',
  templateUrl: './cadaster-report.component.html',
  styleUrls: ['./cadaster-report.component.css'],
})
export class CadasterReportComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: CadasterReportModel[] = []
  cdrReportId!: number
  gridObj: any
  dataViewObj: any
  modalRef: any

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.gridObj = angularGrid.slickGrid
    this.dataViewObj = angularGrid.dataView
  }
  constructor(
    private dialog: MatDialog,
    private cadasterService: CadasterReportService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.prepareGrid()
    this.refreshList()
  }

  refreshList() {
    this.cadasterService.getCadasterReportList(0).subscribe((data) => {
      this.dataset = data
    })
  }

  openCdrReportDialog() {
    this.modalRef = this.dialog.open(CadasterReportFormComponent, {
      width: '600px',
    })
    this.modalRef.componentInstance.addCdrReport.subscribe((data: any) => {
      this.cadasterService
        .addCadasterReport(data)
        .subscribe((result) => this.refreshList())
      this.modalRef.close()
    })
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
      }: any = translations

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
        },
        {
          id: 'oblastName',
          name: OBLAST,
          field: 'oblastName',
          filterable: true,
          sortable: true,
        },
        {
          id: 'regionName',
          name: REGION,
          field: 'regionName',
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
          id: 'action',
          field: 'action',
          width: 30,
          minWidth: 30,
          maxWidth: 40,
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
          formatter: () =>
            `<div style='cursor: pointer; display:flex; justify-content:center; align-items:center; font-size:16px;'>
            <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>`,
          onCellClick: (e: Event, args: OnEventArgs) => {
            const id = args.dataContext.id
            this.router.navigate(['../cadaster-report-list', id], {
              relativeTo: this.route,
            })
          },
        },

        {
          id: 'delete',
          field: 'id',
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
          formatter: Formatters.deleteIcon,
          minWidth: 30,
          maxWidth: 30,
          onCellClick: (e: Event, args: OnEventArgs) => {
            const id = args.dataContext.id
            const dialogData = new ConfirmDialogModel(
              'Подтвердить действие',
              'Вы уверены, что хотите удалить это?',
            )
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
              maxWidth: '400px',
              data: dialogData,
            })
            dialogRef.afterClosed().subscribe((dialogResult) => {
              if (dialogResult) {
                this.cadasterService.deleteCadasterReport(id).subscribe(() => {
                  this.refreshList()
                })
              }
            })
          },
        },
      ]
    })

    this.gridOptions = {}
  }
}
