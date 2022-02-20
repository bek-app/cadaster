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
@Component({
  selector: 'app-cadaster-report-check',
  templateUrl: './cadaster-report-check.component.html',
  styleUrls: ['./cadaster-report-check.component.css'],
})
export class CadasterReportCheckComponent implements OnInit {
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
    private cdrReportDialog: MatDialog,
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
      console.log(data)

      this.dataset = data
    })
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
          formatter: () => `<div class='d-flex justify-content-center' style='width: 35px; cursor: pointer'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-info-square' viewBox='0 0 16 16'>
          <path d='M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z'/>
          <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z'/>
        </svg> </div>`,
          onCellClick: (e: Event, args: OnEventArgs) => {
            const id = args.dataContext.id
            this.router.navigate(['/cdr-report-check-list/', id], {
              relativeTo: this.route,
            })
            this.cadasterService.sendReportData(args.dataContext)
          },
        },
      ]
    })

    this.gridOptions = {
      autoResize: {
        container: '#demo-container',
      },
      enableAutoSizeColumns: true,
      enableAutoResize: true,
      gridWidth: '100%',
      enableFiltering: true,
      enableSorting: true,
      enableCellNavigation: true,
      editable: true,
      autoEdit: true,
      autoCommitEdit: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: false,
      preHeaderPanelHeight: 23,
      explicitInitialization: true,
      enableTranslate: true,
      enableColumnReorder: false,
      enableColumnPicker: false,
      enableCheckboxSelector: false,
      enableRowSelection: true,
      columnPicker: {
        hideForceFitButton: true,
      },
      headerMenu: {
        hideFreezeColumnsCommand: false,
      },
      exportOptions: {
        // set at the grid option level, meaning all column will evaluate the Formatter (when it has a Formatter defined)
        exportWithFormatter: true,
        sanitizeDataExport: true,
      },
      gridMenu: {
        hideExportTextDelimitedCommand: false, // true by default, so if you want it, you will need to disable the flag
      },
      enableExcelExport: true,
      checkboxSelector: {
        // you can toggle these 2 properties to show the "select all" checkbox in different location
        hideInFilterHeaderRow: false,
        hideInColumnTitleRow: true,
      },
    }
  }
}
