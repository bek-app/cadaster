import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { TranslateService } from '@ngx-translate/core'
import {
  AngularGridInstance,
  AngularUtilService,
  Column,
  Editors,
  FieldType,
  Formatter,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid'
import { ReportActivityChangeModel } from 'src/app/models/report-activity-change.model'
import { ReportActivityModel } from 'src/app/models/report-activity.model'
import { ReportCommentModel } from 'src/app/models/report-comment.model'
import { ReportActivityChangeService } from 'src/app/services/report-activity-change.service'
import { ReportCommentService } from 'src/app/services/report-comment.service'
import { ReportSharedService } from 'src/app/services/report-shared.service'
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
  cdrReportId: number = 2
  isExcludingChildWhenFiltering = false
  isAutoApproveParentItemWhenTreeColumnIsValid = true
  editMode = false
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
    private matDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getCommentList(this.cdrReportId)
    this.prepareGrid()
    this.refreshList(2)
  }

  openActivityChangeDialog() {
    this.activityChangeDialogRef = this.matDialog.open(
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

  getCommentList(cdrReportId: number = 2): void {
    this.commentService
      .getReportCommentList(cdrReportId, 'actual')
      .subscribe((data: any) => {
        this.commentList = data
      })
  }

  goToCadasterReports(id: number) {
    this.cdrReportId = id
    this.refreshList(id)
  }

  refreshList(reportId: number) {
    this.reportActivityChangeService
      .getReportActivityChangeList(reportId)
      .subscribe((data) => {
        console.log(data)

        this.dataset = data
      })
  }

  onCellClicked(e: Event, args: OnEventArgs) {
    const item = this.gridObj.getDataItem(args.row)
    this.activityChangeId = item.id

    if (!this.editMode) {
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
              if (confirm('Уверены ли вы?')) {
                this.reportActivityChangeService
                  .deleteReportActivityChange(id)
                  .subscribe(() => {
                    this.refreshList(this.cdrReportId)
                  })
              }
            },
          },
        ]
      })

    this.gridOptions = {
      autoResize: {
        container: '#demo-container',
      },
      gridWidth: '100%',
      enableAutoSizeColumns: true,
      enableAutoResize: true,
      enableExcelExport: true,
      excelExportOptions: {
        exportWithFormatter: true,
        sanitizeDataExport: true,
      },
      autoEdit: true,
      autoCommitEdit: true,
      enableCellNavigation: true,
      editable: true,
      enableFiltering: true,
      enableGrouping: true,
      createPreHeaderPanel: false,
      showPreHeaderPanel: true,
      enableTreeData: false, // you must enable this flag for the filtering & sorting to work as expected
      multiColumnSort: false, // multi-column sorting is not supported with Tree Data, so you need to disable it
      headerRowHeight: 40,
      rowHeight: 30,
      preHeaderPanelHeight: 30,
      showCustomFooter: true,
      // we can also preset collapsed items via Grid Presets (parentId: 4 => is the "pdf" folder)
      presets: {
        treeData: { toggledItems: [{ itemId: 1, isCollapsed: true }] },
      },
      // use Material Design SVG icons
      contextMenu: {
        iconCollapseAllGroupsCommand: 'mdi mdi-arrow-collapse',
        iconExpandAllGroupsCommand: 'mdi mdi-arrow-expand',
        iconClearGroupingCommand: 'mdi mdi-close',
        iconCopyCellValueCommand: 'mdi mdi-content-copy',
        iconExportCsvCommand: 'mdi mdi-download',
        iconExportExcelCommand: 'mdi mdi-file-excel-outline',
        iconExportTextDelimitedCommand: 'mdi mdi-download',
      },
      gridMenu: {
        iconCssClass: 'mdi mdi-menu',
        iconClearAllFiltersCommand: 'mdi mdi-filter-remove-outline',
        iconClearAllSortingCommand: 'mdi mdi-swap-vertical',
        iconExportCsvCommand: 'mdi mdi-download',
        iconExportExcelCommand: 'mdi mdi-file-excel-outline',
        iconExportTextDelimitedCommand: 'mdi mdi-download',
        iconRefreshDatasetCommand: 'mdi mdi-sync',
        iconToggleFilterCommand: 'mdi mdi-flip-vertical',
        iconTogglePreHeaderCommand: 'mdi mdi-flip-vertical',
      },
      headerMenu: {
        iconClearFilterCommand: 'mdi mdi mdi-filter-remove-outline',
        iconClearSortCommand: 'mdi mdi-swap-vertical',
        iconSortAscCommand: 'mdi mdi-sort-ascending',
        iconSortDescCommand: 'mdi mdi-flip-v mdi-sort-descending',
        iconColumnHideCommand: 'mdi mdi-close',
      },
    }
  }
}
