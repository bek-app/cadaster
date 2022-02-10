import { Component, OnInit } from '@angular/core'
import {
  AngularGridInstance,
  AngularUtilService,
  Column,
  Editors,
  FieldType,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid'
import { ReportCommentModel } from 'src/app/models/report-comment.model'
import { ReportSharedService } from 'src/app/services/report-shared.service'
import { ActualEmissionService } from '../../../services/actual-emission.service'
import { CustomInputEditor } from '../../editors/custom-input-editor/custom-input'
import { CustomInputEditorComponent } from '../../editors/custom-input-editor/custom-input-editor.component'
import { reportCadasterTreeFormatter } from '../../formatters/reportCadasterTreeFormatter'
@Component({
  selector: 'app-report-actual-emission',
  templateUrl: './report-actual-emission.component.html',
  styleUrls: ['./report-actual-emission.component.css'],
})
export class ReportActualEmissionComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  gridObj: any
  dataViewObj: any
  cdrReportId: number = 2
  isExcludingChildWhenFiltering = false
  isAutoApproveParentItemWhenTreeColumnIsValid = true
  editMode = false

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.gridObj = angularGrid.slickGrid
    this.dataViewObj = angularGrid.dataView

    this.dataViewObj.getItemMetadata = (row: any) => {
      const newCssClass = 'inactive__header'
      const materialClass = 'sub__header-material'
      const processClass = 'sub__header-process'

      const item = this.dataViewObj.getItem(row)
      console.log(item.key == 'material')

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
    };

    this.gridObj.onBeforeEditCell.subscribe((e: any, args: any) => {
      if (args.item.__hasChildren) {
        return false
      }
      return true
    })
  }

  constructor(
    private angularUtilService: AngularUtilService,
    private actualEmissionService: ActualEmissionService,
    private sharedDataService: ReportSharedService,
  ) {}

  ngOnInit(): void {
    this.prepareGrid()
    this.refreshList(2)
  }

  goToCadasterReports(id: number) {
    this.cdrReportId = id
    this.refreshList(id)
  }

  refreshList(reportId: number) {
    this.actualEmissionService
      .getActualEmissionById(reportId)
      .subscribe((data) => {
        let group: any[] = []
        data.forEach((items) => {
          items.processes.forEach((process: any) => {
            Object.assign(process, {
              processName: process.dicMaterialName,
            })
          })
          items.materials.forEach((material: any) => {
            Object.assign(material, {
              processName: material.dicMaterialName,
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
          ]
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

        this.actualEmissionService.addActualEmission(data).subscribe((res) => {
          console.log(res)

          this.refreshList(this.cdrReportId)
        })
      }
    }
  }
  prepareGrid() {
    this.columnDefinitions = [
      {
        id: 'processName',
        name: 'Наименование процесса',
        field: 'processName',
        type: FieldType.string,
        width: 120,
        formatter: reportCadasterTreeFormatter,
        filterable: true,
        sortable: true,
      },

      {
        id: 'carbonDioxide',
        name: ' Объем выбросов двуокиси углерода,тонн',
        field: 'carbonDioxide',
        filterable: true,
        sortable: true,
        formatter: Formatters.multiple,
        params: {
          formatters: [Formatters.complexObject],
          complexFieldLabel: 'carbonDioxide',
        },
        editor: {
          model: CustomInputEditor,
          params: {
            component: CustomInputEditorComponent,
          },
        },
      },
      {
        id: 'methaneEmissionsTon',
        name: 'тонн',
        field: 'methaneEmissionsTon',
        columnGroup: 'Объем выбросов метана',
        filterable: true,
        sortable: true,
        formatter: Formatters.multiple,
        params: {
          formatters: [Formatters.complexObject],
          complexFieldLabel: 'methaneEmissionsTon',
        },
        editor: {
          model: CustomInputEditor,
          params: {
            component: CustomInputEditorComponent,
          },
        },
      },
      {
        id: 'methaneEmissionsCo2',
        name: 'в эквиваленте тонны двуокиси углерода',
        field: 'methaneEmissionsCo2',
        columnGroup: 'Объем выбросов метана',
        filterable: true,
        sortable: true,
        formatter: Formatters.multiple,
        params: {
          formatters: [Formatters.complexObject],
          complexFieldLabel: 'methaneEmissionsCo2',
        },
        editor: {
          model: CustomInputEditor,
          params: {
            component: CustomInputEditorComponent,
          },
        },
      },

      {
        id: 'nitrousOxideTon',
        name: 'тонн',
        field: 'nitrousOxideTon',
        columnGroup: 'Объем выбросов закиси азота',
        filterable: true,
        sortable: true,
        formatter: Formatters.multiple,
        params: {
          formatters: [Formatters.complexObject],
          complexFieldLabel: 'nitrousOxideTon',
        },
        editor: {
          model: CustomInputEditor,
          params: {
            component: CustomInputEditorComponent,
          },
        },
      },
      {
        id: 'nitrousOxideCo2',
        name: 'в эквиваленте тонны двуокиси углерода',
        field: 'nitrousOxideCo2',
        columnGroup: 'Объем выбросов закиси азота',
        filterable: true,
        sortable: true,
        formatter: Formatters.multiple,
        params: {
          formatters: [Formatters.complexObject],
          complexFieldLabel: 'nitrousOxideCo2',
        },
        editor: {
          model: CustomInputEditor,
          params: {
            component: CustomInputEditorComponent,
          },
        },
      },
      {
        id: 'perfluorocarbonTon',
        name: 'тонн',
        field: 'perfluorocarbonTon',
        columnGroup: 'Объем выбросов перфторуглеродов',
        filterable: true,
        sortable: true,
        formatter: Formatters.multiple,
        params: {
          formatters: [Formatters.complexObject],
          complexFieldLabel: 'perfluorocarbonTon',
        },
        editor: {
          model: CustomInputEditor,
          params: {
            component: CustomInputEditorComponent,
          },
        },
      },
      {
        id: 'perfluorocarbonCo2',
        name: 'в эквиваленте тонны двуокиси углерода',
        field: 'perfluorocarbonCo2',
        columnGroup: 'Объем выбросов перфторуглеродов',

        filterable: true,
        sortable: true,
        formatter: Formatters.multiple,
        params: {
          formatters: [Formatters.complexObject],
          complexFieldLabel: 'perfluorocarbonCo2',
        },
        editor: {
          model: CustomInputEditor,
          params: {
            component: CustomInputEditorComponent,
          },
        },
      },

      {
        id: 'totalCo2',
        name: 'totalCo2',
        field: 'totalCo2',
        filterable: true,
        sortable: true,
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
        excludeChildrenWhenFilteringTree: this.isExcludingChildWhenFiltering,
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
