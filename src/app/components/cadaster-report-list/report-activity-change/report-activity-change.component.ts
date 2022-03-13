import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Params } from '@angular/router'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { TranslateService } from '@ngx-translate/core'
import {
  AngularGridInstance,
  Column,
  Formatter,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid'
import { ReportActivityChangeModel } from 'src/app/models/report-activity-change.model'
import { ReportCommentModel } from 'src/app/models/report-comment.model'
import { ReportActivityChangeService } from 'src/app/services/report-activity-change.service'
import { ReportCommentService } from 'src/app/services/report-comment.service'
import { ReportSharedService } from 'src/app/services/report-shared.service'
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../confirm-dialog/confirm-dialog.component'
import { ActivityChangeFormComponent } from './activity-change-form/activity-change-form.component'
@Component({
  selector: 'app-report-activity-change',
  templateUrl: './report-activity-change.component.html',
  styleUrls: ['./report-activity-change.component.css'],
})
export class ReportActivityChangeComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: ReportActivityChangeModel[] = []
  gridObj: any
  dataViewObj: any
  cdrReportId!: number
  isExcludingChildWhenFiltering = false
  isAutoApproveParentItemWhenTreeColumnIsValid = true
  commentList: ReportCommentModel[] = []
  faPlus = faPlus
  activityChangeDialogRef: any
  activityChangeId!: number

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.gridObj = angularGrid.slickGrid
    this.dataViewObj = angularGrid.dataView

    this.dataViewObj.getItemMetadata = (row: any) => {
      const newCssClass = 'inactive__header'
      const materialClass = 'sub__header-material'
      const processClass = 'sub__header-process'

      const item = this.dataViewObj.getItem(row)

      if (item.__hasChildren && item.__treeLevel === 0) {
        return {
          cssClasses: newCssClass,
        }
      } else if (item.key == 'material') {
        return {
          cssClasses: materialClass,
        }
      } else if (item.key == 'processes') {
        return {
          cssClasses: processClass,
        }
      } else return ''
    }

    this.gridObj.onBeforeEditCell.subscribe((e: any, args: any) => {
      if (args.item.__hasChildren) {
        return false
      }
      return true
    })
  }

  constructor(
    private reportActivityChangeService: ReportActivityChangeService,
    private sharedDataService: ReportSharedService,
    private translate: TranslateService,
    private commentService: ReportCommentService,
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

  openActivityChangeDialog() {
    this.activityChangeDialogRef = this.dialog.open(
      ActivityChangeFormComponent,
      {
        width: '800px',
      },
    )
    this.onActivityChangeAdded()
    this.onActivityChangeUpdated()
  }

  onActivityChangeAdded() {
    this.activityChangeDialogRef.componentInstance.onActivityChangeAdded.subscribe(
      (data: ReportActivityChangeModel) => {
        const newData = {
          id: 0,
          reportId: this.cdrReportId,
          ...data,
        }
        this.reportActivityChangeService
          .addReportActivityChange(newData)
          .subscribe(() => {
            this.activityChangeDialogRef.close()
            this.refreshList(this.cdrReportId)
          })
      },
    )
  }

  onActivityChangeUpdated() {
    this.activityChangeDialogRef.componentInstance.onActivityChangeUpdated.subscribe(
      (data: ReportActivityChangeModel) => {
        const newData = {
          id: this.activityChangeId,
          reportId: this.cdrReportId,
          ...data,
        }
        this.reportActivityChangeService
          .updateReportActivityChange(newData)
          .subscribe(() => {
            this.activityChangeDialogRef.close()
            this.refreshList(this.cdrReportId)
          })
      },
    )
  }

  getCommentList(cdrReportId: number): void {
    this.commentService
      .getReportCommentList(cdrReportId, 'activity-change')
      .subscribe((data: any) => (this.commentList = data))
  }

  refreshList(reportId: number) {
    this.reportActivityChangeService
      .getReportActivityChangeList(reportId)
      .subscribe((data) => (this.dataset = data))
  }

  onCellClicked(e: Event, args: OnEventArgs) {
    const item = this.gridObj.getDataItem(args.row)
    this.activityChangeId = item.id

    const metadata = this.angularGrid.gridService.getColumnFromEventArguments(
      args,
    )
    const { id } = metadata.dataContext
    const { field } = metadata.columnDef
    if (field !== 'processName') {
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
            discriminator: 'activity-change',
            isMark: true,
            isActive: true,
            reportId: this.cdrReportId,
          }

          this.sharedDataService.sendComment(comment)
        }
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
    this.translate
      .get('CDR_REPORTS.ACTIVITY_CHANGE')
      .subscribe((translations) => {
        const { ROOT_ACTIVITY_NAME, CHANGE_DATA, NOTE } = translations

        this.columnDefinitions = [
          {
            id: 'rootActivityName',
            name: ROOT_ACTIVITY_NAME,
            field: 'rootActivityName',
            filterable: true,
            sortable: true,
          },

          {
            id: 'changeData',
            name: CHANGE_DATA,
            field: 'changeData',
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
              this.openActivityChangeDialog()
              this.activityChangeDialogRef.componentInstance.editForm(
                this.activityChangeId,
              )
              this.activityChangeDialogRef.componentInstance.form.disable()
              this.activityChangeDialogRef.componentInstance.viewMode = true
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
              this.openActivityChangeDialog()
              this.activityChangeDialogRef.componentInstance.editForm(
                this.activityChangeId,
              )
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
                  this.reportActivityChangeService
                    .deleteReportActivityChange(id)
                    .subscribe(() => {
                      this.refreshList(this.cdrReportId)
                    })
                }
              })
            },
          },
        ]
      })

    this.gridOptions = { enableFiltering: true }
  }
}
