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
    private deviceDialog: MatDialog,
    private plantDeviceService: PlantDeviceService,
    private plantService: PlantService,
    private translate: TranslateService,
  ) {
    translate.get('PLANT.DEVICE.FORM').subscribe((translations: string) => {
      this.columnDefinitions = [
        {
          id: 'nameDevice',
          name:  translations['NAME_DEVICE' as any],
          field: 'nameDevice',
          filterable: true,
          sortable: true,
        },
        {
          id: 'identificationNumber',
          name:  translations['IDENTIFICATION_NUMBER' as any],
          field: 'identificationNumber',
          filterable: true,
          sortable: true,
        },
        {
          id: 'unitDevice',
          name:  translations['UNIT_DEVICE' as any],
          field: 'unitDevice',
          filterable: true,
          sortable: true,
        },
        {
          id: 'lowerLimit',
          name:  translations['LOWER_LIMIT' as any],
          field: 'lowerLimit',
          filterable: true,
          sortable: true,
        },
        {
          id: 'upperLimit',
          name:  translations['UPPER_LIMIT' as any],
          field: 'upperLimit',
          filterable: true,
          sortable: true,
        },
        {
          id: 'specifiedUncertainty',
          name:  translations['SPECIFIED_UNCERTAINTY' as any],
          field: 'specifiedUncertainty',
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
            this.deviceId = args.dataContext.id
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
            if (confirm('Уверены ли вы?')) {
              this.plantDeviceService
                .deletePlantDevice(id)
                .subscribe(() => this.refreshList(this.plantId))
            }
          },
        },
      ]
    })
  }

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
    this.ref = this.deviceDialog.open(DeviceFormComponent, { width: '600px' })
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

  prepareGrid() {
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
