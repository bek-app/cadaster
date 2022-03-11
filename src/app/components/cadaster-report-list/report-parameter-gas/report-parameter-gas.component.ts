import { Component, OnInit } from '@angular/core'
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
import { ParameterGasService } from 'src/app/services/parameter-gas.service'
import { ParameterGasModel } from 'src/app/models/parameter-gas.model'
import { reportCadasterTreeFormatter } from '../../formatters/reportCadasterTreeFormatter'
import { ReportCommentModel } from 'src/app/models/report-comment.model'
import { ReportCommentService } from 'src/app/services/report-comment.service'
import { NotificationService } from 'src/app/services/notification.service'
import { ReportSharedService } from 'src/app/services/report-shared.service'
import { CustomInputEditor } from '../../editors/custom-input-editor/custom-input'
import { CustomInputEditorComponent } from '../../editors/custom-input-editor/custom-input-editor.component'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'app-report-parameter-gas',
  templateUrl: './report-parameter-gas.component.html',
  styleUrls: ['./report-parameter-gas.component.css'],
})
export class ReportParameterGasComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: ParameterGasModel[] = []
  gridObj: any
  dataViewObj: any
  isExcludingChildWhenFiltering = false
  isAutoApproveParentItemWhenTreeColumnIsValid = true
  dicUnitList: any[] = []
  cdrReportId!: number
  dialogRef: any
  commentList: ReportCommentModel[] = []

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
      if (!args.item.__hasChildren) {
        return true
      }
      return false
    })
  }
  constructor(
    private parameterGasService: ParameterGasService,
    private activatedRoute: ActivatedRoute,
    private angularUtilService: AngularUtilService,
    private commentService: ReportCommentService,
    private notificationService: NotificationService,
    private sharedDataService: ReportSharedService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(
      (res: any) => {
        this.dicUnitList = res.dicUnit
        console.log(res.dicUnit);

      },
    )
    this.activatedRoute.params.subscribe((param: Params) => {
      this.cdrReportId = +param['id']
      this.refreshList(this.cdrReportId)
      this.getCommentList(this.cdrReportId)
    })
    this.prepareGrid()
  }

  refreshList(cdrReportId: number) {
    this.parameterGasService
      .getParameterGasById(cdrReportId)
      .subscribe((data) => {
        let group: any[] = []
        data.forEach((items) => {
          items.materials.forEach((material: any) => {
            Object.assign(material, {
              processName: material.dicMaterialName,
              gasCh4Unit: {
                id: material.gasCh4UnitId,
                name: material.gasCh4UnitName,
              },
              gasN2OUnit: {
                id: material.gasN2OUnitId,
                name: material.gasN2OUnitName,
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

  getCommentList(cdrReportId: number): void {
    this.commentService
      .getReportCommentList(this.cdrReportId, 'gas')
      .subscribe((data: any) => {
        this.commentList = data
      })
  }

  gasCommentFormatter: Formatter = (
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
      addClasses: res ? 'border border-danger' : '',
      text: value ? value : '',
    }
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
            discriminator: 'gas',
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

        this.parameterGasService
          .addParameterGas(data)
          .subscribe((result: any) => {
            console.log(result)

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
    this.translate
      .get('CDR_REPORTS.PARAMETER_GAS')
      .subscribe((translations: any) => {
        const {
          PROCESS_NAME,
          GAS_CH4,
          EMISSION_COEF,
          UNIT_NAME,
          GAS_N20,
          GAS_PROC_O2,
          GAS_COEF_FUEL_NATURE,
          GAS_WEIGTH_N20,
          GAS_WEIGTH_CH4,
        } = translations
        this.columnDefinitions = [
          {
            id: 'processName',
            name: PROCESS_NAME,
            field: 'processName',
            type: FieldType.string,
            width: 120,
            formatter: reportCadasterTreeFormatter,
            filterable: true,
            sortable: true,
          },

          // Измеренная объемная концентрация метана (CH4) в выхлопных газах при коэффициенте избытка воздуха α
          {
            id: 'gasCh4',
            name: GAS_CH4,
            field: 'gasCh4',
            columnGroup: EMISSION_COEF,
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [this.gasCommentFormatter, Formatters.complexObject],
              complexFieldLabel: 'gasCh4',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },
          {
            id: 'gasCh4Unit',
            name: UNIT_NAME,
            field: 'gasCh4Unit',
            columnGroup: EMISSION_COEF,
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject, this.gasCommentFormatter],
              complexFieldLabel: 'gasCh4Unit.name',
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
              const gasCh4Unit = args.dataContext.gasCh4Unit
              let discriminator = args.dataContext.discriminator

              const data = {
                id,
                nameField: 'GasCh4UnitId',
                valueField:
                  gasCh4Unit.id != null
                    ? gasCh4Unit.id.toString()
                    : gasCh4Unit.id,
                discriminator,
              }
              this.parameterGasService
                .addParameterGas(data)
                .subscribe((res: any) => {})
            },
          },

          /// Измеренная объемная концентрация закиси азота (N2O) в выхлопных газах при коэффициенте избытка воздуха α
          {
            id: 'gasN2O',
            name: GAS_N20,
            field: 'gasN2O',
            columnGroup: EMISSION_COEF,
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [this.gasCommentFormatter, Formatters.complexObject],
              complexFieldLabel: 'gasN2O',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },
          {
            id: 'gasN2OUnit',
            name: UNIT_NAME,
            field: 'gasN2OUnit',
            columnGroup: EMISSION_COEF,
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject, this.gasCommentFormatter],
              complexFieldLabel: 'gasN2OUnit.name',
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
              const gasN2OUnit = args.dataContext.gasN2OUnit
              let discriminator = args.dataContext.discriminator

              const data = {
                id,
                nameField: 'GasN2OUnitId',
                valueField:
                  gasN2OUnit.id != null
                    ? gasN2OUnit.id.toString()
                    : gasN2OUnit.id,
                discriminator,
              }
              this.parameterGasService
                .addParameterGas(data)
                .subscribe((res: any) => {})
            },
          },

          /// Измеренная концентрация кислорода (О2) в месте отбора пробы дымовых газов, %
          {
            id: 'gasProcО2',
            name: GAS_PROC_O2,
            field: 'gasProcО2',
            columnGroup: EMISSION_COEF,
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [this.gasCommentFormatter, Formatters.complexObject],
              complexFieldLabel: 'gasProcО2',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },

          /// Коэффициент, учитывающий характер топлива
          {
            id: 'gasKoeffFuelNature',
            name: GAS_COEF_FUEL_NATURE,
            field: 'gasKoeffFuelNature',
            columnGroup: EMISSION_COEF,
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [this.gasCommentFormatter, Formatters.complexObject],
              complexFieldLabel: 'gasKoeffFuelNature',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },

          /// Удельная масса загрязняющих веществ ,закись азота (N2O), кг/нм^3
          {
            id: 'gasWeightN2O',
            name: GAS_WEIGTH_N20,
            field: 'gasWeightN2O',
            columnGroup: EMISSION_COEF,
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [this.gasCommentFormatter, Formatters.complexObject],
              complexFieldLabel: 'gasWeightN2O',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },

          /// Удельная масса загрязняющих веществ, метан (CH4), кг/нм^3
          {
            id: 'gasWeightCh4',
            name: GAS_WEIGTH_CH4,
            field: 'gasWeightCh4',
            columnGroup: EMISSION_COEF,
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [this.gasCommentFormatter, Formatters.complexObject],
              complexFieldLabel: 'gasWeightCh4',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },
        ]
      })

    this.gridOptions = {
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
}
