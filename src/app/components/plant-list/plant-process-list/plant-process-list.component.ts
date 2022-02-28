import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { TranslateService } from '@ngx-translate/core'
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid'
import { Dictionary } from 'src/app/models/dictionary.model'
import { PlantProcessModel } from 'src/app/models/plant-process.model '
import { PlantService } from 'src/app/services/plant.service'
import { PlantProcessService } from '../../../services/plant-process.service'
import { ProcessFormComponent } from './process-form/process-form.component'
@Component({
  selector: 'app-plant-process-list',
  templateUrl: './plant-process-list.component.html',
  styleUrls: ['./plant-process-list.component.css'],
})
export class PlantProcessListComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: PlantProcessModel[] = []
  plantId!: number
  processId!: number
  gridObj: any
  dataViewObj: any
  isActive = false
  submitted = false
  namePlant!: string
  dicProcessList: Dictionary[] = []
  @ViewChild('content') content: any
  ref: any
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.gridObj = angularGrid.slickGrid
    this.dataViewObj = angularGrid.dataView
  }

  constructor(
    private plantProcessDialog: MatDialog,
    private plantProcessService: PlantProcessService,
    private plantService: PlantService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.plantService.plantIdRefreshList.subscribe((item: any) => {
      this.plantId = item.id

      // this.namePlant = item.namePlant;
      this.refreshList(this.plantId)
    })
    this.prepareGrid()
  }

  refreshList(id: number) {
    this.plantProcessService
      .getPlantProcessList(id)
      .subscribe((data) => (this.dataset = data))
  }

  goToPlants(id: number) {
    this.plantId = id
    this.refreshList(id)
  }

  openProcessFormDialog() {
    this.ref = this.plantProcessDialog.open(ProcessFormComponent, {
      width: '800px',
    })
    this.addProcess()
    this.updateProcess()
  }

  addProcess() {
    this.ref.componentInstance.addProcess.subscribe((data: any) => {
      this.plantProcessService
        .addPlantProcess({ id: 0, plantId: this.plantId, ...data })
        .subscribe(() => {
          this.ref.close()
          this.refreshList(this.plantId)
        })
    })
  }

  updateProcess() {
    this.ref.componentInstance.updateProcess.subscribe((data: any) => {
      this.plantProcessService
        .updatePlantProcess({
          id: this.processId,
          plantId: this.plantId,
          ...data,
        })
        .subscribe(() => {
          this.ref.close()
          this.refreshList(this.plantId)
        })
    })
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row)
    this.processId = item.id
  }

  prepareGrid() {
    this.translate.get('PLANT.PROCESS.LIST').subscribe((translations: any) => {
      const {
        PROCESS_NAME,
        SUBPROCESS_NAME,
        MATERIALS_NAMES,
        ODDS_LEVEL,
        AMOUNT_CONSUMED,
        CALCULATION_CALORIFIC,
        COLUMN_GROUP,
        CALCULATION_CARBON,
        CALCULATION_CONVERSION,
      } = translations

      this.columnDefinitions = [
        {
          id: 'processName',
          name: PROCESS_NAME,
          field: 'processName',
          filterable: true,
          sortable: true,
        },
        {
          id: 'subProccessNames',
          name: SUBPROCESS_NAME,
          field: 'subProccessNames',
          filterable: true,
          sortable: true,
        },
        {
          id: 'materialNames',
          name: MATERIALS_NAMES,
          field: 'materialNames',
          filterable: true,
          sortable: true,
        },
        {
          id: 'oddsLevel',
          name: ODDS_LEVEL,
          field: 'oddsLevel',
          filterable: true,
          sortable: true,
        },

        {
          id: 'amountConsumed',
          name: AMOUNT_CONSUMED,
          field: 'amountConsumed',
          filterable: true,
          sortable: true,
        },
        {
          id: 'calculatingCalorific',
          name: CALCULATION_CALORIFIC,
          columnGroup: COLUMN_GROUP,
          field: 'calculatingCalorific',
          filterable: true,
          sortable: true,
        },
        {
          id: 'calculatingConversion',
          name: CALCULATION_CONVERSION,
          columnGroup: COLUMN_GROUP,
          field: 'calculatingConversion',
          filterable: true,
          sortable: true,
        },
        {
          id: 'calculatingCarbon',
          name: CALCULATION_CARBON,
          columnGroup: COLUMN_GROUP,
          field: 'calculatingCarbon',
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
            this.openProcessFormDialog()
            this.ref.componentInstance.editForm(this.processId)
            this.ref.componentInstance.form.disable()
            this.ref.componentInstance.viewMode = true
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
            this.openProcessFormDialog()
            this.ref.componentInstance.editForm(this.processId)
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
              this.plantProcessService
                .deletePlantProcess(id)
                .subscribe(() => this.refreshList(this.plantId))
            }
          },
        },
      ]
    })
    this.gridOptions = {
      autoResize: {
        container: '#demo-container',
      },
      enableCellNavigation: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 25,
      explicitInitialization: true,
      enableAutoSizeColumns: true,
      enableAutoResize: true,
      gridWidth: '100%',
      enableFiltering: true,
      enableSorting: true,
      editable: true,
      autoEdit: true,
      autoCommitEdit: true,
      enableTranslate: true,
      enableColumnReorder: false,
      enableColumnPicker: false,
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
