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
import { PlantDeviceModel } from 'src/app/models/plant-device.model'
import { PlantDeviceService } from 'src/app/services/plant-device.service'
import { PlantService } from 'src/app/services/plant.service'
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../confirm-dialog/confirm-dialog.component'
import { DeviceFormComponent } from './device-form/device-form.component'
@Component({
  selector: 'app-plant-device-list',
  templateUrl: './plant-device-list.component.html',
  styleUrls: ['./plant-device-list.component.css'],
})
export class PlantDeviceListComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: PlantDeviceModel[] = []
  plantId!: number
  deviceId!: number
  gridObj: any
  dataViewObj: any
  isActive = false
  namePlant!: string
  ref: any
  deviceFormComponent!: DeviceFormComponent
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.gridObj = angularGrid.slickGrid
    this.dataViewObj = angularGrid.dataView
  }
  constructor(
    private dialog: MatDialog,
    private plantDeviceService: PlantDeviceService,
    private plantService: PlantService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.plantService.plantIdRefreshList.subscribe((item: any) => {
      this.plantId = item.id
      // this.namePlant = item.name;
      this.refreshList(this.plantId)
    })
    this.prepareGrid()
  }

  refreshList(plantId: number) {
    this.plantDeviceService.getPlantDeviceList(plantId).subscribe((data) => {
      this.dataset = data
    })
  }

  goToPlants(id: number) {
    this.plantId = id
    this.refreshList(id)
  }

  openDeviceDialog() {
    this.ref = this.dialog.open(DeviceFormComponent, { width: '600px' })
    this.addPlantDevice()
    this.updatePlantDevice()
  }

  addPlantDevice() {
    this.ref.componentInstance.addDevice.subscribe((data: any) => {
      this.plantDeviceService
        .addPlantDevice({
          id: 0,
          plantId: this.plantId,
          ...data,
        })
        .subscribe(() => {
          this.refreshList(this.plantId)
          this.ref.close()
        })
    })
  }

  updatePlantDevice() {
    this.ref.componentInstance.updateDevice.subscribe((data: any) => {
      this.plantDeviceService
        .updatePlantDevice({
          id: this.deviceId,
          plantId: this.plantId,
          ...data,
        })
        .subscribe(() => {
          this.refreshList(this.plantId)
          this.ref.close()
        })
    })
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row)
    this.deviceId = item.id
  }

  prepareGrid() {
    this.translate.get('PLANT.DEVICE.FORM').subscribe((translations: any) => {
      const {
        NAME_DEVICE,
        IDENTIFICATION_NUMBER,
        UNIT_DEVICE,
        LOWER_LIMIT,
        UPPER_LIMIT,
        SPECIFIED_UNCERTAINTY,
        MEASURING_RANGE,
      } = translations

      this.columnDefinitions = [
        {
          id: 'nameDevice',
          name: NAME_DEVICE,
          field: 'nameDevice',
          filterable: true,
          sortable: true,
        },
        {
          id: 'identificationNumber',
          name: IDENTIFICATION_NUMBER,
          field: 'identificationNumber',
          filterable: true,
          sortable: true,
        },
        {
          id: 'unitDevice',
          name: UNIT_DEVICE,
          columnGroup: MEASURING_RANGE,
          field: 'unitDevice',
          filterable: true,
          sortable: true,
        },
        {
          id: 'lowerLimit',
          name: LOWER_LIMIT,
          field: 'lowerLimit',
          columnGroup: MEASURING_RANGE,
          filterable: true,
          sortable: true,
        },
        {
          id: 'upperLimit',
          name: UPPER_LIMIT,
          field: 'upperLimit',
          columnGroup: MEASURING_RANGE,
          filterable: true,
          sortable: true,
        },
        {
          id: 'specifiedUncertainty',
          name: SPECIFIED_UNCERTAINTY,
          field: 'specifiedUncertainty',
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
            this.openDeviceDialog()
            this.ref.componentInstance.editForm(this.deviceId)
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
            this.openDeviceDialog()
            this.ref.componentInstance.editForm(this.deviceId)
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
                this.plantDeviceService
                  .deletePlantDevice(id)
                  .subscribe(() => this.refreshList(this.plantId))
              }
            })
          },
        },
      ]
    })

    this.gridOptions = {
      preHeaderPanelHeight: 50,
    }
  }
}
