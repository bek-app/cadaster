import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Params } from '@angular/router'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { ReportPlanModel } from '@models/report-plan.model'
import { TranslateService } from '@ngx-translate/core'
import { ReportPlanService } from '@services/report-plan.service'
import {
  AngularGridInstance,
  Column,
  Formatter,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid'
import { ReportCommentModel } from 'src/app/models/report-comment.model'
import { ReportCommentService } from 'src/app/services/report-comment.service'
import { ReportSharedService } from 'src/app/services/report-shared.service'
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../confirm-dialog/confirm-dialog.component'
import { PlanFormComponent } from './plan-form/plan-form.component'
@Component({
  selector: 'app-report-plan',
  templateUrl: './report-plan.component.html',
  styleUrls: ['./report-plan.component.css'],
})
export class ReportPlanComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any
  gridObj: any
  dataViewObj: any
  cdrReportId!: number
  isExcludingChildWhenFiltering = false
  isAutoApproveParentItemWhenTreeColumnIsValid = true
  editMode = false
  commentList: ReportCommentModel[] = []
  planFormRef: any
  planId!: number
  faPlus = faPlus
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.gridObj = angularGrid.slickGrid
    this.dataViewObj = angularGrid.dataView
  }

  constructor(
    private sharedDataService: ReportSharedService,
    private translate: TranslateService,
    private commentService: ReportCommentService,
    private planService: ReportPlanService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.prepareGrid()
    this.activatedRoute.params.subscribe((param: Params) => {
      this.cdrReportId = +param['id']
      this.refreshList(this.cdrReportId)
      this.getCommentList(this.cdrReportId)
    })
  }

  openPlanFormDialog() {
    this.planFormRef = this.dialog.open(PlanFormComponent, {
      width: '800px',
      data: { reportId: this.cdrReportId },
    })
    this.onPlanAdded()
    this.onPlanUpdated()
  }

  onPlanAdded() {
    this.planFormRef.componentInstance.onPlanAdded.subscribe(
      (data: ReportPlanModel) => {
        const newData = {
          id: 0,
          reportId: this.cdrReportId,
          ...data,
        }
        this.planService.addReportPlan(newData).subscribe(() => {
          this.planFormRef.close()
          this.refreshList(this.cdrReportId)
        })
      },
    )
  }

  onPlanUpdated() {
    this.planFormRef.componentInstance.onPlanUpdated.subscribe(
      (data: ReportPlanModel) => {
        const newData = {
          id: this.planId,
          reportId: this.cdrReportId,
          ...data,
        }
        this.planService.updateReportPlan(newData).subscribe(() => {
          this.planFormRef.close()
          this.refreshList(this.cdrReportId)
        })
      },
    )
  }

  getCommentList(cdrReportId: number = 2): void {
    this.commentService
      .getReportCommentList(cdrReportId, 'plan')
      .subscribe((data: any) => (this.commentList = data))
  }

  refreshList(reportId: number) {
    this.planService
      .getReportPlanByReportId(reportId)
      .subscribe((data: any) => (this.dataset = data))
  }

  onCellClicked(e: Event, args: OnEventArgs) {
    const metadata = this.angularGrid.gridService.getColumnFromEventArguments(
      args,
    )
    const { id } = metadata.dataContext
    const { field } = metadata.columnDef
    this.planId = id

    for (const item in metadata.dataContext) {
      if (field === item) {
        let controlValue = metadata.dataContext[item]
        let newControlValue

        if (typeof controlValue === 'object' && controlValue !== null) {
          newControlValue = controlValue.name
        } else if (controlValue === null) {
          newControlValue = controlValue
        } else newControlValue = controlValue.toString()

        const comment: ReportCommentModel = {
          id: 0,
          note: '',
          recordId: id.toString(),
          controlId: field,
          controlValue: newControlValue,
          discriminator: 'plan',
          isMark: true,
          isActive: true,
          reportId: this.cdrReportId,
        }

        this.sharedDataService.sendComment(comment)
      }
    }
  }

  onCellChanged(e: Event, args: OnEventArgs) {}

  commentFormatter: Formatter = (
    row: number,
    cell: number,
    value: any,
    columnDef: Column,
    dataContext: any,
    grid?: any,
  ) => {
    const { id } = dataContext
    const { field } = columnDef

    const res = this.commentList.find((comment) => {
      return comment.recordId === id.toString() && comment.controlId === field
    })
    return {
      addClasses: res ? 'border' : '',
      text: value ? value : '',
    }
  }

  prepareGrid() {
    this.translate.get('CDR_REPORTS.PLAN').subscribe((translations) => {
      const {
        PROCESS_NAME,
        PERIODICITY,
        DEVIATIONS,
        REASONS,
        NOTE,
      } = translations

      this.columnDefinitions = [
        {
          id: 'plantProcessName',
          name: PROCESS_NAME,
          field: 'plantProcessName',
          filterable: true,
          sortable: true,
        },

        {
          id: 'periodicity',
          name: PERIODICITY,
          field: 'periodicity',
          filterable: true,
          sortable: true,
        },

        {
          id: 'deviations',
          name: DEVIATIONS,
          field: 'deviations',
          filterable: true,
          sortable: true,
        },

        {
          id: 'reasons',
          name: REASONS,
          field: 'reasons',
          filterable: true,
          sortable: true,
        },
        {
          id: 'note',
          name: NOTE,
          field: 'note',
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
          formatter: () => `<span class="mdi mdi-loupe"></span>`,
          onCellClick: (e: Event, args: OnEventArgs) => {
            this.openPlanFormDialog()
            this.planFormRef.componentInstance.editForm(this.planId)
            this.planFormRef.componentInstance.form.disable()
            this.planFormRef.componentInstance.viewMode = true
          },
        },
        {
          id: 'edit',
          field: 'id',
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
          formatter: Formatters.editIcon,
          minWidth: 30,
          maxWidth: 30,
          onCellClick: (e: Event, args: OnEventArgs) => {
            this.openPlanFormDialog()
            this.planFormRef.componentInstance.editForm(this.planId)
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
                this.planService.deleteReportPlan(id).subscribe(() => {
                  this.refreshList(this.cdrReportId)
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
