import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import {
  AngularGridInstance,
  Column,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid'
import { CadasterReportModel } from 'src/app/models/cadaster-report.model'
import { CadasterReportService } from 'src/app/services/cadaster-report.service'
@Component({
  selector: 'app-cadaster-report-check',
  templateUrl: './cadaster-report-check.component.html',
  styleUrls: ['./cadaster-report-check.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CadasterReportCheckComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: CadasterReportModel[] = []
  gridObj: any
  dataViewObj: any

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.gridObj = angularGrid.slickGrid
    this.dataViewObj = angularGrid.dataView
    this.dataViewObj.getItemMetadata = (row: any) => {
      const statusDraft = 'status__draft'

      const statusProvided = 'status__provided'

      const statusApproved = 'status__approved'

      const statusExplanations = 'status__explanations'

      const statusIncomplete = 'status__incomplete'

      const statusNotCorrect = 'status__notCorrect'

      const item = this.dataViewObj.getItem(row)

      switch (item.statusId) {
        case 1:
          return { cssClasses: statusDraft }
        case 2:
          return { cssClasses: statusProvided }
        case 3:
          return { cssClasses: statusApproved }
        case 4:
          return { cssClasses: statusExplanations }
        case 5:
          return { cssClasses: statusIncomplete }
        case 6:
          return { cssClasses: statusNotCorrect }
      }
      return ''
    }
  }

  constructor(
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
    this.cadasterService
      .getCadasterReportList(0)
      .subscribe((data) => (this.dataset = data))
  }

  prepareGrid() {
    this.translate.get('CDR_REPORT.FORM').subscribe((translations) => {
      const {
        NAME_PLANT,
        OBLAST,
        REGION,
        ADDRESS,
        REPORT_YEAR,
        BIN,
        NAME_ORG,
        REG_NUMBER,
        STATUS_NAME,
      } = translations

      this.columnDefinitions = [
        {
          id: 'regNumber',
          name: REG_NUMBER,
          field: 'regNumber',
          filterable: true,
          sortable: true,
        },
        {
          id: 'bin',
          name: BIN,
          field: 'bin',
          filterable: true,
          sortable: true,
        },
        {
          id: 'nameOrg',
          name: NAME_ORG,
          field: 'nameOrg',
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
          id: 'statusName',
          name: STATUS_NAME,
          field: 'statusName',
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
            this.router.navigate(['../cdr-report-check-list/', id], {
              relativeTo: this.route,
            })
          },
        },
      ]
    })

    this.gridOptions = {}
  }
}
