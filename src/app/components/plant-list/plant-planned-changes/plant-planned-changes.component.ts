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
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../confirm-dialog/confirm-dialog.component'
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
    private dialog: MatDialog,
    private plannedChangesService: PlannedChangesService,
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
    this.plannedChangesService
      .getPlannedChangesList(id)
      .subscribe((data) => (this.dataset = data))
  }

  openPlannedChangesDialog() {
    this.ref = this.dialog.open(PlannedChangesFormComponent, {
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

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row)
    this.plannedChangeId = item.id
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
          id: 'view',
          field: 'id',
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
          minWidth: 30,
          maxWidth: 30,
          formatter: () => `<span class="mdi mdi-loupe"></span>`,
          onCellClick: (e: Event, args: OnEventArgs) => {
            this.openPlannedChangesDialog()
            this.ref.componentInstance.editForm(this.plannedChangeId)
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
                this.plannedChangesService
                  .deletePlannedChanges(id)
                  .subscribe((data) => {
                    this.refreshList(this.plantId)
                  })
              }
            })
          },
        },
      ]
    })
    this.gridOptions = {}
  }
}
