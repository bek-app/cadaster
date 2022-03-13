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
import { ActivatedRoute, Params } from '@angular/router'
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
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'app-report-parameter-koef',
  templateUrl: './report-parameter-koef.component.html',
  styleUrls: ['./report-parameter-koef.component.css'],
})
export class ReportParameterKoefComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: ParameterKoefModel[] = []
  gridObj: any
  dataViewObj: any
  isExcludingChildWhenFiltering = false
  isAutoApproveParentItemWhenTreeColumnIsValid = true
  dicUnitList: any[] = []
  cdrReportId!: number
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
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      (response: any) => (this.dicUnitList = response.dicUnit),
    )
    this.prepareGrid()
    this.activatedRoute.params.subscribe((param: Params) => {
      this.cdrReportId = +param['id']
      this.refreshList(this.cdrReportId)
      this.getCommentList(this.cdrReportId)
    })
  }

  getCommentList(reportId: number): void {
    this.commentService
      .getReportCommentList(reportId, 'coeff')
      .subscribe((data: any) => (this.commentList = data))
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
            discriminator: 'coeff',
            isMark: true,
            isActive: true,
            reportId: this.cdrReportId,
          }
          this.sharedDataService.sendComment(comment)
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
              : this.notificationService.error(`${result.message}`)
          })
      }
    }
  }

  prepareGrid() {
    this.translate
      .get('CDR_REPORTS.PARAMETER_COEFF')
      .subscribe((translations: any) => {
        const {
          PROCESS_NAME,
          COEF_VOLUME,
          MATERIAL_NAME,
          UNIT_NAME,
          COEFF_OPERATING_WEIGTH,
          COEFF_LOWER_CALORIFIC,
          COEFF_CASE_BURNING,
          COEF_CO2,
          COEF_CH4,
          COEF_N20,
          COEF_PERFLURO_CARBONS,
          COEF_USED_CALC,
        } = translations
        this.columnDefinitions = [
          {
            id: 'processName',
            name: PROCESS_NAME,
            field: 'processName',
            type: FieldType.string,
            width: 170,
            formatter: reportCadasterTreeFormatter,
            filterable: true,
          },

          /// Фактический объем
          {
            id: 'koefVolume',
            name: COEF_VOLUME,
            field: 'koefVolume',
            columnGroup: MATERIAL_NAME,
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
            name: UNIT_NAME,
            field: 'dicUnit',
            columnGroup: MATERIAL_NAME,
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
              const discriminator = args.dataContext.discriminator
              const data = {
                id,
                nameField: 'DicUnitId',
                valueField:
                  dicUnit.id != null ? dicUnit.id.toString() : dicUnit.id,
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
                    : this.notificationService.error(`${result.message}`)
                })
            },
          },

          // Содержание углерода
          {
            id: 'koefOperatingWeight',
            name: COEFF_OPERATING_WEIGTH,
            field: 'koefOperatingWeight',
            columnGroup: COEF_USED_CALC,
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
            name: UNIT_NAME,
            field: 'koefOperatingWeightUnit',
            columnGroup: COEF_USED_CALC,
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
              const discriminator = args.dataContext.discriminator
              const data = {
                id,
                nameField: 'KoefOperatingWeightUnitId',
                valueField:
                  koefOperatingWeightUnit.id != null
                    ? koefOperatingWeightUnit.id.toString()
                    : koefOperatingWeightUnit.id,
                discriminator,
              }

              this.parameterKoefService
                .addParameterKoef(data)
                .subscribe((res: any) => {})
            },
          },

          // Коэффициент низшей теплоты сгорания
          {
            id: 'koefLowerCalorific',
            name: COEFF_LOWER_CALORIFIC,
            field: 'koefLowerCalorific',
            columnGroup: COEF_USED_CALC,
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
            name: UNIT_NAME,
            field: 'koefLowerCalorificUnit',
            columnGroup: COEF_USED_CALC,
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
              const koefLowerCalorificUnit =
                args.dataContext.koefLowerCalorificUnit
              const discriminator = args.dataContext.discriminator

              const data = {
                id,
                nameField: 'KoefLowerCalorificUnitId',
                valueField:
                  koefLowerCalorificUnit.id != null
                    ? koefLowerCalorificUnit.id.toString()
                    : koefLowerCalorificUnit.id,
                discriminator,
              }
              this.parameterKoefService
                .addParameterKoef(data)
                .subscribe((res: any) => {})
            },
          },

          // Коэффициент окисления
          {
            id: 'koefCaseBurning',
            name: COEFF_CASE_BURNING,
            field: 'koefCaseBurning',
            columnGroup: COEF_USED_CALC,
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
            name: UNIT_NAME,
            field: 'koefCaseBurningUnit',
            columnGroup: COEF_USED_CALC,
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
              const discriminator = args.dataContext.discriminator

              const data = {
                id,
                nameField: 'KoefCaseBurningUnitId',
                valueField:
                  koefCaseBurningUnit.id != null
                    ? koefCaseBurningUnit.id.toString()
                    : koefCaseBurningUnit.id,
                discriminator,
              }
              this.parameterKoefService
                .addParameterKoef(data)
                .subscribe((res: any) => {})
            },
          },

          // Двуокись углерода (СО2)
          {
            id: 'koefCo2',
            name: COEF_CO2,
            field: 'koefCo2',
            columnGroup: COEF_USED_CALC,
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
            name: UNIT_NAME,
            field: 'koefCo2Unit',
            columnGroup: COEF_USED_CALC,
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
              const discriminator = args.dataContext.discriminator

              const data = {
                id,
                nameField: 'KoefCo2UnitId',
                valueField:
                  koefCo2Unit.id != null
                    ? koefCo2Unit.id.toString()
                    : koefCo2Unit.id,
                discriminator,
              }
              this.parameterKoefService
                .addParameterKoef(data)
                .subscribe((res: any) => {})
            },
          },

          // Метан (СН4)
          {
            id: 'koefCh4',
            name: COEF_CH4,
            field: 'koefCh4',
            columnGroup: COEF_USED_CALC,
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
            name: UNIT_NAME,
            field: 'koefCh4Unit',
            columnGroup: COEF_USED_CALC,
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
              const discriminator = args.dataContext.discriminator

              const data = {
                id,
                nameField: 'KoefCh4UnitId',
                valueField:
                  koefCh4Unit.id != null
                    ? koefCh4Unit.id.toString()
                    : koefCh4Unit.id,
                discriminator,
              }
              this.parameterKoefService
                .addParameterKoef(data)
                .subscribe((res: any) => {})
            },
          },

          // Закиси азота (N2O)
          {
            id: 'koefN2O',
            name: COEF_N20,
            field: 'koefN2O',
            columnGroup: COEF_USED_CALC,
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
            name: UNIT_NAME,
            field: 'koefN2OUnit',
            columnGroup: COEF_USED_CALC,
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
              const discriminator = args.dataContext.discriminator

              const data = {
                id,
                nameField: 'KoefN2OUnitId',
                valueField:
                  koefN2OUnit.id != null
                    ? koefN2OUnit.id.toString()
                    : koefN2OUnit.id,
                discriminator,
              }
              this.parameterKoefService
                .addParameterKoef(data)
                .subscribe((res: any) => {})
            },
          },

          // Перфторуглероды
          {
            id: 'koefPerfluorocarbons',
            name: COEF_PERFLURO_CARBONS,
            field: 'koefPerfluorocarbons',
            columnGroup: COEF_USED_CALC,
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
            name: UNIT_NAME,
            field: 'koefPerfluorocarbonsUnit',
            columnGroup: COEF_USED_CALC,
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
              const discriminator = args.dataContext.discriminator

              const data = {
                id,
                nameField: 'KoefPerfluorocarbonsUnitId',
                valueField:
                  koefPerfluorocarbonsUnit.id != null
                    ? koefPerfluorocarbonsUnit.id.toString()
                    : koefPerfluorocarbonsUnit.id,
                discriminator,
              }
              this.parameterKoefService
                .addParameterKoef(data)
                .subscribe((res: any) => {})
            },
          },
        ]
      })

    this.gridOptions = {
      enableFiltering: true,
      showPreHeaderPanel: true,
      enableTreeData: true, // you must enable this flag for the filtering & sorting to work as expected
      multiColumnSort: false, // multi-column sorting is not supported with Tree Data, so you need to disable it
      treeDataOptions: {
        columnId: 'processName',
        childrenPropName: 'group',
        excludeChildrenWhenFilteringTree: this.isExcludingChildWhenFiltering, // defaults to false

        autoApproveParentItemWhenTreeColumnIsValid: this
          .isAutoApproveParentItemWhenTreeColumnIsValid,
      },
      params: {
        angularUtilService: this.angularUtilService, // provide the service to all at once (Editor, Filter, AsyncPostRender)
      },

      presets: {
        treeData: { toggledItems: [{ itemId: 4, isCollapsed: true }] },
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
