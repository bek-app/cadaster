import { ReportProductModel } from './../../../models/report-product.model'
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
import { ReportProductService } from '../../../services/report-product.service'
import { TranslateService } from '@ngx-translate/core'
import { ReportCommentModel } from 'src/app/models/report-comment.model'
import { ReportCommentService } from 'src/app/services/report-comment.service'
import { ReportSharedService } from 'src/app/services/report-shared.service'
import { CustomInputEditor } from '../../editors/custom-input-editor/custom-input'
import { CustomInputEditorComponent } from '../../editors/custom-input-editor/custom-input-editor.component'
@Component({
  selector: 'app-report-product',
  templateUrl: './report-product.component.html',
  styleUrls: ['./report-product.component.css'],
})
export class ReportProductComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: ReportProductModel[] = []
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
      const item = this.dataViewObj.getItem(row)
      if (item.__hasChildren) {
        return {
          cssClasses: newCssClass,
        }
      } else {
        return ''
      }
    }
    this.gridObj.onBeforeEditCell.subscribe((e: any, args: any) => {
      if (args.item.__hasChildren) {
        return false
      }
      return true
    })
  }
  constructor(
    private reportProductService: ReportProductService,
    private translateService: TranslateService,
    private commentService: ReportCommentService,
    private sharedDataService: ReportSharedService,
    private angularUtilService: AngularUtilService,
  ) {}

  ngOnInit(): void {
    this.prepareGrid()
    this.refreshList(2)
  }

  getCommentList(): void {
    this.commentService
      .getReportCommentList((this.cdrReportId = 2), 'product')
      .subscribe((data: any) => {
        this.commentList = data
      })
  }

  goToCadasterReports(id: number) {
    this.cdrReportId = id
    this.refreshList(id)
  }

  refreshList(reportId: number) {
    this.reportProductService
      .getReportProductById(reportId)
      .subscribe((data) => {
        this.dataset = data
      })
  }

  onCellClicked(e: Event, args: OnEventArgs) {
    const metadata = this.angularGrid.gridService.getColumnFromEventArguments(
      args,
    )
    const { id } = metadata.dataContext
    const { field } = metadata.columnDef

    if (field !== 'productName') {
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
            discriminator: 'product',
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
        let valueField = metadata.dataContext[item].toString()

        let discriminator = metadata.dataContext.discriminator

        const data = {
          id,
          nameField,
          valueField,
        }

        this.reportProductService
          .addReportProduct(data)
          .subscribe((res: any) => {})
      }
    }
  }

  prepareGrid() {
    this.translateService
      .get('CDR_REPORTS.PRODUCT')
      .subscribe((translations: any) => {
        const {
          PRODUCT_NAME,
          PRODUCT_VOLUME,
          UNIT_NAME,
          PRODUCT_CARBON_DIOXIDE,
          PRODUCT_METHANE,
          PRODUCT_NITROUS_OXIDE,
          PRODUCT_PERFLUORO_CARBONS,
          GAS_EMISSION_VOLUME,
        } = translations
        this.columnDefinitions = [
          {
            id: 'productName',
            name: PRODUCT_NAME,
            field: 'productName',
            filterable: true,
            sortable: true,
          },
          {
            id: 'productVolume',
            name: PRODUCT_VOLUME,
            field: 'productVolume',
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject],
              complexFieldLabel: 'productVolume',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },
          {
            id: 'unitName',
            name: UNIT_NAME,
            field: 'unitName',
            filterable: true,
            sortable: true,
          },
          {
            id: 'productCarbonDioxide',
            name: PRODUCT_CARBON_DIOXIDE,
            field: 'productCarbonDioxide',
            columnGroup: GAS_EMISSION_VOLUME,
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject],
              complexFieldLabel: 'productCarbonDioxide',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },
          {
            id: 'productMethane',
            name: PRODUCT_METHANE,
            field: 'productMethane',
            columnGroup: GAS_EMISSION_VOLUME,
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject],
              complexFieldLabel: 'productMethane',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },
          {
            id: 'productNitrousOxide',
            name: PRODUCT_NITROUS_OXIDE,
            field: 'productNitrousOxide',
            columnGroup: GAS_EMISSION_VOLUME,
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject],
              complexFieldLabel: 'productNitrousOxide',
            },
            editor: {
              model: CustomInputEditor,
              params: {
                component: CustomInputEditorComponent,
              },
            },
          },

          {
            id: 'productPerfluorocarbons',
            name: PRODUCT_PERFLUORO_CARBONS,
            field: 'productPerfluorocarbons',
            columnGroup: '',
            filterable: true,
            sortable: true,
            formatter: Formatters.multiple,
            params: {
              formatters: [Formatters.complexObject],
              complexFieldLabel: 'productPerfluorocarbons',
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
      enableTreeData: false, // you must enable this flag for the filtering & sorting to work as expected
      multiColumnSort: false, // multi-column sorting is not supported with Tree Data, so you need to disable it

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
}
