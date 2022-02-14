import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import {
  AngularGridInstance,
  AngularUtilService,
  Column,
  FieldType,
  Formatter,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid'
import { ActivatedRoute } from '@angular/router'
import { CustomSelectEditor } from '../../editors/custom-select-editor/custom-select'
import { CustomSelectEditorComponent } from '../../editors/custom-select-editor/custom-select-editor.component'
import { ParameterKoefModel } from 'src/app/models/parameter-koef.model'
import { ParameterKoefService } from 'src/app/services/parameter-koef.service'
import { reportCadasterTreeFormatter } from '../../formatters/reportCadasterTreeFormatter'
import { ReportSharedService } from 'src/app/services/report-shared.service'
import { ReportCommentModel } from 'src/app/models/report-comment.model'
import { NotificationService } from 'src/app/services/notification.service'
import { CustomInputEditor } from '../../editors/custom-input-editor/custom-input'
import { CustomInputEditorComponent } from '../../editors/custom-input-editor/custom-input-editor.component'
import { ReportCommentService } from 'src/app/services/report-comment.service'
@Component({
  selector: 'app-report-parameter-koef',
  templateUrl: './report-parameter-koef.component.html',
  styleUrls: ['./report-parameter-koef.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportParameterKoefComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: ParameterKoefModel[] = []
  cadasterId!: number
  gridObj: any
  dataViewObj: any
  isExcludingChildWhenFiltering = false
  isAutoApproveParentItemWhenTreeColumnIsValid = true
  dicUnitList: any[] = []
  cdrReportId: number = 2
  editMode = false
  commentList: any[] = []
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
    private parameterKoefService: ParameterKoefService,
    private activatedRoute: ActivatedRoute,
    private angularUtilService: AngularUtilService,
    private sharedDataService: ReportSharedService,
    private notificationService: NotificationService,
    private commentService: ReportCommentService,
  ) {}

  ngOnInit(): void {
    this.getCommentList()
    this.activatedRoute.data.subscribe((response: any) => {
      this.dicUnitList = response.dicUnit
    })
    this.refreshList(2)
    this.prepareGrid()
  }
  getCommentList(): void {
    this.commentService
      .getReportCommentList((this.cdrReportId = 2), 'calc')
      .subscribe((data: any) => {
        this.commentList = data
      })
  }

  goToCadasterReports(id: number) {
    this.cdrReportId = id
    this.refreshList(id)
  }

  refreshList(reportId: number) {
    this.parameterKoefService
      .getParameterKoefById(reportId)
      .subscribe((data) => {
        let group: any[] = []

        data.forEach((items) => {
          items.materials.forEach((material: any) => {
            Object.assign(material, {
              processName: material.dicMaterialName,

              dicUnit: {
                id: material.dicUnitId,
                name: material.dicUnitName,
              },

              koefOperatingWeightUnit: {
                id: material.koefOperatingWeightUnitId,
                name: material.koefOperatingWeightUnitName,
              },

              koefLowerCalorificUnit: {
                id: material.koefLowerCalorificUnitId,
                name: material.koefLowerCalorificUnitName,
              },

              koefCaseBurningUnit: {
                id: material.koefCaseBurningUnitId,
                name: material.koefCaseBurningUnitName,
              },
              koefCo2Unit: {
                id: material.koefCo2UnitId,
                name: material.koefCo2UnitName,
              },
              koefCh4Unit: {
                id: material.koefCh4UnitId,
                name: material.koefCh4UnitName,
              },
              koefN2OUnit: {
                id: material.koefN2OUnitId,
                name: material.koefN2OUnitName,
              },
              koefPerfluorocarbonsUnit: {
                id: material.koefPerfluorocarbonsUnitId,
                name: material.koefPerfluorocarbonsUnitName,
              },
            })
          })
          items.processes.forEach((process: any) => {
            Object.assign(process, {
              processName: process.dicMaterialName,
            })
          })

          group = [
            {
              id: '_' + Math.random().toString(36),
              processName: 'Сырье',
              group: [...items.materials],
              key: 'material',
            },
            {
              id: '_' + Math.random().toString(36),
              processName: 'Подпроцессы',
              group: [...items.processes],
              key: 'processes',
            },
          ].sort((a, b) => (a.processName < b.processName ? 1 : -1))
          Object.assign(items, { group })
        })

        this.dataset = data
      })
  }

  onCellClicked(e: Event, args: OnEventArgs) {
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
              discriminator: 'calc',
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

  onCellChanged(e: Event, args: OnEventArgs) {
    const metadata = this.angularGrid.gridService.getColumnFromEventArguments(
      args,
    )

    const { id } = metadata.dataContext
    const { field } = metadata.columnDef

    for (let item in metadata.dataContext) {
      if (field === item) {
        let nameField = item[0].toUpperCase() + item.slice(1)
        let valueField = metadata.dataContext[item]
        let newValueField
        let discriminator = metadata.dataContext.discriminator

        if (typeof valueField === 'object') {
          return
        } else newValueField = valueField.toString()

        const data = {
          id,
          nameField,
          valueField: newValueField,
          discriminator,
        }

        this.parameterKoefService
          .addParameterKoef(data)
          .subscribe((result: any) => {
            result.isSuccess
              ? this.notificationService.success(
                  '“Ваши данные сохранены”',
                  'Done',
                )
              : this.notificationService.error(`${result.message}`, 'Done')
          })
      }
    }
  }

  prepareGrid() {
    this.columnDefinitions = [
      {
        id: 'processName',
        name: 'Наименование производственного процесса',
        field: 'processName',
        type: FieldType.string,
        width: 170,
        formatter: reportCadasterTreeFormatter,
        filterable: true,
      },

      /// Фактический объем
      {
        id: 'koefVolume',
        name: 'Фактический объем',
        field: 'koefVolume',
        columnGroup: 'Наименование сырья',
        filterable: true,
        sortable: true,
        formatter: Formatters.multiple,
        params: {
          formatters: [this.koefCommentFormatter, Formatters.complexObject],
          complexFieldLabel: 'koefVolume',
        },
        editor: {
          model: CustomInputEditor,
          params: {
            component: CustomInputEditorComponent,
          },
        },
      },
      {
        id: 'dicUnit',
        name: 'Ед. измерения ',
        field: 'dicUnit',
        columnGroup: 'Наименование сырья',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'dicUnit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: CustomSelectEditorComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id
          const dicUnit = args.dataContext.dicUnit
          const data = {
            id,
            nameField: 'DicUnitId',
            valueField: dicUnit.id != null ? dicUnit.id.toString() : dicUnit.id,
          }
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => {})
        },
      },

      // Содержание углерода
      {
        id: 'koefOperatingWeight',
        name: 'Содержание углерода  ',
        field: 'koefOperatingWeight',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.multiple,
        params: {
          formatters: [this.koefCommentFormatter, Formatters.complexObject],
          complexFieldLabel: 'koefOperatingWeight',
        },
        editor: {
          model: CustomInputEditor,
          params: {
            component: CustomInputEditorComponent,
          },
        },
      },
      {
        id: 'koefOperatingWeightUnit',
        name: 'Ед.измерения',
        field: 'koefOperatingWeightUnit',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'koefOperatingWeightUnit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: CustomSelectEditorComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id
          const koefOperatingWeightUnit =
            args.dataContext.koefOperatingWeightUnit
          const data = {
            id,
            nameField: 'KoefOperatingWeightUnitId',
            valueField:
              koefOperatingWeightUnit.id != null
                ? koefOperatingWeightUnit.id.toString()
                : koefOperatingWeightUnit.id,
          }

          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => {})
        },
      },

      // Коэффициент низшей теплоты сгорания
      {
        id: 'koefLowerCalorific',
        name: 'Коэффициент низшей теплоты сгорания',
        field: 'koefLowerCalorific',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.multiple,
        params: {
          formatters: [this.koefCommentFormatter, Formatters.complexObject],
          complexFieldLabel: 'koefLowerCalorific',
        },
        editor: {
          model: CustomInputEditor,
          params: {
            component: CustomInputEditorComponent,
          },
        },
      },
      {
        id: 'koefLowerCalorificUnit',
        name: 'Ед.измерения',
        field: 'koefLowerCalorificUnit',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'koefLowerCalorificUnit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: CustomSelectEditorComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id
          const koefLowerCalorificUnit = args.dataContext.koefLowerCalorificUnit
          const data = {
            id,
            nameField: 'KoefLowerCalorificUnitId',
            valueField:
              koefLowerCalorificUnit.id != null
                ? koefLowerCalorificUnit.id.toString()
                : koefLowerCalorificUnit.id,
          }
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => {})
        },
      },

      // Коэффициент окисления
      {
        id: 'koefCaseBurning',
        name: 'Коэффициент окисления',
        field: 'koefCaseBurning',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.multiple,
        params: {
          formatters: [this.koefCommentFormatter, Formatters.complexObject],
          complexFieldLabel: 'koefCaseBurning',
        },
        editor: {
          model: CustomInputEditor,
          params: {
            component: CustomInputEditorComponent,
          },
        },
      },
      {
        id: 'koefCaseBurningUnit',
        name: 'Ед.измерения',
        field: 'koefCaseBurningUnit',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'koefCaseBurningUnit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: CustomSelectEditorComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id
          const koefCaseBurningUnit = args.dataContext.koefCaseBurningUnit
          const data = {
            id,
            nameField: 'KoefCaseBurningUnitId',
            valueField:
              koefCaseBurningUnit.id != null
                ? koefCaseBurningUnit.id.toString()
                : koefCaseBurningUnit.id,
          }
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => {})
        },
      },

      // Двуокись углерода (СО2)
      {
        id: 'koefCo2',
        name: 'Двуокись углерода (СО2)',
        field: 'koefCo2',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.multiple,
        params: {
          formatters: [this.koefCommentFormatter, Formatters.complexObject],
          complexFieldLabel: 'koefCo2',
        },
        editor: {
          model: CustomInputEditor,
          params: {
            component: CustomInputEditorComponent,
          },
        },
      },
      {
        id: 'koefCo2Unit',
        name: 'Ед.измерения',
        field: 'koefCo2Unit',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'koefCo2Unit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: CustomSelectEditorComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id
          const koefCo2Unit = args.dataContext.koefCo2Unit
          const data = {
            id,
            nameField: 'KoefCo2UnitId',
            valueField:
              koefCo2Unit.id != null
                ? koefCo2Unit.id.toString()
                : koefCo2Unit.id,
          }
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => {})
        },
      },

      // Метан (СН4)
      {
        id: 'koefCh4',
        name: 'Метан (СН4)',
        field: 'koefCh4',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.multiple,
        params: {
          formatters: [this.koefCommentFormatter, Formatters.complexObject],
          complexFieldLabel: 'koefCh4',
        },
        editor: {
          model: CustomInputEditor,
          params: {
            component: CustomInputEditorComponent,
          },
        },
      },
      {
        id: 'koefCh4Unit',
        name: 'Ед.измерения',
        field: 'koefCh4Unit',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'koefCh4Unit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: CustomSelectEditorComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id
          const koefCh4Unit = args.dataContext.koefCh4Unit
          const data = {
            id,
            nameField: 'KoefCh4UnitId',
            valueField:
              koefCh4Unit.id != null
                ? koefCh4Unit.id.toString()
                : koefCh4Unit.id,
          }
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => {})
        },
      },

      // Закиси азота (N2O)
      {
        id: 'koefN2O',
        name: 'Закиси азота (N2O)',
        field: 'koefN2O',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.multiple,
        params: {
          formatters: [this.koefCommentFormatter, Formatters.complexObject],
          complexFieldLabel: 'koefN2O',
        },
        editor: {
          model: CustomInputEditor,
          params: {
            component: CustomInputEditorComponent,
          },
        },
      },
      {
        id: 'koefN2OUnit',
        name: 'Ед.измерения',
        field: 'koefN2OUnit',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'koefN2OUnit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: CustomSelectEditorComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id
          const koefN2OUnit = args.dataContext.koefN2OUnit
          const data = {
            id,
            nameField: 'KoefN2OUnitId',
            valueField:
              koefN2OUnit.id != null
                ? koefN2OUnit.id.toString()
                : koefN2OUnit.id,
          }
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => {})
        },
      },

      // Перфторуглероды
      {
        id: 'koefPerfluorocarbons',
        name: 'Перфторуглероды',
        field: 'koefPerfluorocarbons',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.multiple,
        params: {
          formatters: [this.koefCommentFormatter, Formatters.complexObject],
          complexFieldLabel: 'koefPerfluorocarbons',
        },
        editor: {
          model: CustomInputEditor,
          params: {
            component: CustomInputEditorComponent,
          },
        },
      },
      {
        id: 'koefPerfluorocarbonsUnit',
        name: 'Ед.измерения',
        field: 'koefPerfluorocarbonsUnit',
        columnGroup: 'Коэффициенты, использованные для расчетов',
        filterable: true,
        sortable: true,
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'koefPerfluorocarbonsUnit.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomSelectEditor,
          collection: this.dicUnitList,
          params: {
            component: CustomSelectEditorComponent,
          },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id
          const koefPerfluorocarbonsUnit =
            args.dataContext.koefPerfluorocarbonsUnit
          const data = {
            id,
            nameField: 'KoefPerfluorocarbonsUnitId',
            valueField:
              koefPerfluorocarbonsUnit.id != null
                ? koefPerfluorocarbonsUnit.id.toString()
                : koefPerfluorocarbonsUnit.id,
          }
          this.parameterKoefService
            .addParameterKoef(data)
            .subscribe((res: any) => {})
        },
      },
    ]

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
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      enableTreeData: true, // you must enable this flag for the filtering & sorting to work as expected
      multiColumnSort: false, // multi-column sorting is not supported with Tree Data, so you need to disable it
      treeDataOptions: {
        columnId: 'processName',
        childrenPropName: 'group',
        excludeChildrenWhenFilteringTree: this.isExcludingChildWhenFiltering, // defaults to false

        autoApproveParentItemWhenTreeColumnIsValid: this
          .isAutoApproveParentItemWhenTreeColumnIsValid,
          initialSort: {
            columnId: 'processName',
            direction: 'DESC',
          },
      },
      params: {
        angularUtilService: this.angularUtilService, // provide the service to all at once (Editor, Filter, AsyncPostRender)
      },
      // change header/cell row height for salesforce theme
      headerRowHeight: 45,
      rowHeight: 50,
      showCustomFooter: true,

      // we can also preset collapsed items via Grid Presets (parentId: 4 => is the "pdf" folder)
      presets: {
        treeData: { toggledItems: [{ itemId: 4, isCollapsed: true }] },
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
  koefCommentFormatter: Formatter = (
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
}
