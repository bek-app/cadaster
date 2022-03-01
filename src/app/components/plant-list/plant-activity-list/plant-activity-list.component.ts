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
import { PlantActivityModel } from 'src/app/models/plant-activity.model'
import { PlantSourceModel } from 'src/app/models/plant-source.model'
import { PlantActivityService } from 'src/app/services/plant-activity.service'
import { PlantSourceService } from 'src/app/services/plant-source.service'
import { PlantService } from 'src/app/services/plant.service'
import { ActivityFormComponent } from './activity-form/activity-form.component'
@Component({
  selector: 'app-plant-activity-list',
  templateUrl: './plant-activity-list.component.html',
  styleUrls: ['./plant-activity-list.component.css'],
})
export class PlantActivityListComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: PlantActivityModel[] = []
  plantId!: number
  activityId!: number
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
    private plantSourceDialog: MatDialog,
    private plantActivityService: PlantActivityService,
    private plantService: PlantService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.prepareGrid()
    this.plantService.plantIdRefreshList.subscribe((item: any) => {
      this.plantId = item.id
      // this.namePlant = item.namePlant;
      this.refreshList(this.plantId)
    })
  }

  goToPlants(id: number) {
    this.plantId = id
    this.refreshList(id)
  }

  refreshList(id: number) {
    this.plantActivityService.getPlantActivityList(id).subscribe((data) => {
      this.dataset = data
    })
  }

  openActivityDialog() {
    this.ref = this.plantSourceDialog.open(ActivityFormComponent, {})
    this.onActivityAdded()
    this.onActivityUpdated()
  }

  onActivityAdded() {
    this.ref.componentInstance.onPlantSourceAdded.subscribe(
      (data: PlantActivityModel) => {
        const newData = { id: 0, plantId: this.plantId, ...data }
        this.plantActivityService
          .addPlantActivity(newData)
          .subscribe((res) => this.refreshList(this.plantId))
      },
    )
  }

  onActivityUpdated() {
    this.ref.componentInstance.onPlantSourceUpdated.subscribe(
      (data: PlantActivityModel) => {
        const newData = {
          id: this.activityId,
          plantId: this.plantId,
          ...data,
        }
        this.plantActivityService
          .updatePlantActivity(newData)
          .subscribe((res) => this.refreshList(this.plantId))
      },
    )
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row)
    this.activityId = item.id
  }

  prepareGrid() {
    this.translate.get('PLANT.ACTIVITY.FORM').subscribe((translations: any) => {
      const { ROOT_ACTIVITY_NAME, ACTIVITY_NAME, DIC_UNIT_NAME } = translations
      this.columnDefinitions = [
        {
          id: 'rootActivityName',
          name: ROOT_ACTIVITY_NAME,
          field: 'rootActivityName',
          filterable: true,
          sortable: true,
        },
        {
          id: 'activityName',
          name: ACTIVITY_NAME,
          field: 'activityName',
          filterable: true,
          sortable: true,
        },
        {
          id: 'dicUnitName',
          name: DIC_UNIT_NAME,
          field: 'dicUnitName',
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
            this.openActivityDialog()
            this.ref.componentInstance.editForm(this.activityId)
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
            this.openActivityDialog()
            this.ref.componentInstance.editForm(this.activityId)
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
              this.plantActivityService
                .deletePlantActivity(id)
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
