import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { TranslateService } from '@ngx-translate/core'
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  Observable,
  OnEventArgs,
} from 'angular-slickgrid'
import { PlannedChangesModel } from 'src/app/models/plant-planned-changes.model'
import { PlannedChangesService } from 'src/app/services/planned-changes.service'
import { PlantService } from 'src/app/services/plant.service'
import { PlannedChangesFormComponent } from './planned-changes-form/planned-changes-form.component'
@Component({
  selector: 'app-plant-planned-changes',
  templateUrl: './plant-planned-changes.component.html',
  styleUrls: ['./plant-planned-changes.component.css'],
})
export class PlantPlannedChangesComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  plantId!: number
  plannedChangeId!: number
  gridObj: any
  dataViewObj: any
  ref: any
  namePlant!: string

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.gridObj = angularGrid.slickGrid
    this.dataViewObj = angularGrid.dataView
  }

  constructor(
    private plannedChangesDialog: MatDialog,
    private plannedChangesService: PlannedChangesService,
    private plantService: PlantService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.prepareGrid()
    this.plantService.plantIdRefreshList.subscribe((item: any) => {
      this.plantId = item.id
      console.log(item)

      // this.namePlant = item.namePlant;
      this.refreshList(this.plantId)
    })
  }

  goToPlants(id: number) {
    this.plantId = id
    this.refreshList(id)
  }

  refreshList(id: number) {
    this.plannedChangesService
      .getPlannedChangesList(id)
      .subscribe((data) => (this.dataset = data))
  }

  openPlannedChangesDialog() {
    this.ref = this.plannedChangesDialog.open(PlannedChangesFormComponent, {
      data: { plantId: this.plantId },
      width: '800px',
    })
    this.onPlannedChangesAdded()
    this.onPlannedChangesUpdated()
  }

  onPlannedChangesAdded() {
    this.ref.componentInstance.onPlannedChangesAdded.subscribe(
      (data: PlannedChangesModel) => {
        const newData = { id: 0, plantId: this.plantId, ...data }
        this.plannedChangesService
          .addPlannedChanges(newData)
          .subscribe((res) => this.refreshList(this.plantId))
        this.ref.close()
      },
    )
  }

  onPlannedChangesUpdated() {
    this.ref.componentInstance.onPlannedChangesUpdated.subscribe(
      (data: PlannedChangesModel) => {
        const newData = {
          id: this.plannedChangeId,
          plantId: this.plantId,
          ...data,
        }
        this.plannedChangesService
          .updatePlannedChanges(newData)
          .subscribe((res) => this.refreshList(this.plantId))
        this.ref.close()
      },
    )
  }

  prepareGrid() {
    this.translate.get('PLANT.PLANNED_CHANGES').subscribe((translations) => {
      const {
        TITLE,
        CHANGE_YEAR,
        PROCESS_NAME,
        SOURCE_NAME,
        PLANNED_CHANGE,
      } = translations
      this.columnDefinitions = [
        {
          id: 'plantSourceName',
          name: SOURCE_NAME,
          field: 'plantSourceName',
          filterable: true,
          sortable: true,
        },
        {
          id: 'plantProcessName',
          name: PROCESS_NAME,
          field: 'plantProcessName',
          filterable: true,
          sortable: true,
        },

        {
          id: 'plannedChange',
          name: PLANNED_CHANGE,
          field: 'plannedChange',
          filterable: true,
          sortable: true,
        },
        {
          id: 'changeYear',
          name: CHANGE_YEAR,
          field: 'changeYear',
          filterable: true,
          sortable: true,
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
            this.plannedChangeId = args.dataContext.id
            this.openPlannedChangesDialog()
            this.ref.componentInstance.editForm(this.plannedChangeId)
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
              this.plannedChangesService
                .deletePlannedChanges(id)
                .subscribe((data) => {
                  this.refreshList(this.plantId)
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
