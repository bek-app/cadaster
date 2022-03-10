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
import { PlantSamplingModel } from 'src/app/models/plant-sampling.model'
import { PlantService } from 'src/app/services/plant.service'
import { PlantSamplingService } from '../../../services/plant-sampling.service'
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../confirm-dialog/confirm-dialog.component'
import { SamplingFormComponent } from './sampling-form/sampling-form.component'
@Component({
  selector: 'app-plant-sampling-list',
  templateUrl: './plant-sampling-list.component.html',
  styleUrls: ['./plant-sampling-list.component.css'],
})
export class PlantSamplingListComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: PlantSamplingModel[] = []
  plantId!: number
  samplingId!: number
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
    private plantService: PlantService,
    private samplingService: PlantSamplingService,
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
    this.samplingService.getPlantSamplingList(id).subscribe((data) => {
      this.dataset = data
    })
  }

  openSamplingDialog() {
    this.ref = this.dialog.open(SamplingFormComponent, {
      width: '800px',
    })
    this.onSamplingAdded()
    this.onSamplingUpdated()
  }

  onSamplingAdded() {
    this.ref.componentInstance.onSamplingAdded.subscribe(
      (data: PlantSamplingModel) => {
        const newData = { id: 0, plantId: this.plantId, ...data }
        this.samplingService.addPlantSampling(newData).subscribe((data) => {
          this.refreshList(this.plantId)
          this.ref.close()
        })
      },
    )
  }

  onSamplingUpdated() {
    this.ref.componentInstance.onSamplingUpdated.subscribe(
      (data: PlantSamplingModel) => {
        const newData = {
          id: this.samplingId,
          plantId: this.plantId,
          ...data,
        }
        this.samplingService.updatePlantSampling(newData).subscribe((data) => {
          this.refreshList(this.plantId)
          this.ref.close()
        })
      },
    )
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row)
    this.samplingId = item.id
  }

  prepareGrid() {
    this.translate.get('PLANT.SAMPLING.FORM').subscribe((translations: any) => {
      this.columnDefinitions = [
        {
          id: 'nameSampling',
          name: translations['NAME'],
          field: 'nameSampling',
          filterable: true,
          sortable: true,
        },
        {
          id: 'materialNames',
          name: translations['MATERIALS'],
          field: 'materialNames',
          filterable: true,
          sortable: true,
        },
        {
          id: 'param',
          name: translations['PARAM'],
          field: 'param',
          filterable: true,
          sortable: true,
        },
        {
          id: 'methodSampling',
          name: translations['METHOD'],
          field: 'methodSampling',
          filterable: true,
          sortable: true,
        },

        {
          id: 'frequencySampling',
          name: translations['FREQUENCY'],
          field: 'frequencySampling',
          filterable: true,
          sortable: true,
        },
        {
          id: 'periodTransmission',
          name: translations['PERIOD_TRANSMISSION'],
          field: 'periodTransmission',
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
            this.openSamplingDialog()
            this.ref.componentInstance.editForm(this.samplingId)
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
            this.openSamplingDialog()
            this.ref.componentInstance.editForm(this.samplingId)
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
                this.samplingService.deletePlantSampling(id).subscribe(() => {
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
