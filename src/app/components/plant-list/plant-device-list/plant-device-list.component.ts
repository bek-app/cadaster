import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { PlantDeviceModel } from 'src/app/models/plant-device.model';
import { PlantDeviceService } from 'src/app/services/plant-device.service';
import { PlantService } from 'src/app/services/plant.service';
import { DeviceFormComponent } from './device-form/device-form.component';
@Component({
  selector: 'app-plant-device-list',
  templateUrl: './plant-device-list.component.html',
  styleUrls: ['./plant-device-list.component.css'],
})
export class PlantDeviceListComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: PlantDeviceModel[] = [];
  plantId!: number;
  deviceId!: number;
  gridObj: any;
  dataViewObj: any;
  isActive = false;
  namePlant!: string;
  ref: any;
  @ViewChild('content') content: any;
  deviceFormComponent!: DeviceFormComponent;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }
  constructor(
    private modalService: NgbModal,
    private plantDeviceService: PlantDeviceService,
    private plantService: PlantService
  ) {}

  ngOnInit(): void {
    this.plantService.plantIdRefreshList.subscribe((item: any) => {
      this.plantId = item.id;
      // this.namePlant = item.name;
      this.refreshList(this.plantId);
    });
    this.prepareGrid();
  }

  refreshList(plantId: number) {
    this.plantDeviceService.getPlantDeviceList(plantId).subscribe((data) => {
      this.dataset = data;
    });
  }
  goToPlants(id: number) {
    this.plantId = id;
    this.refreshList(id);
  }
  openPlantDeviceModal() {
    this.ref = this.modalService.open(DeviceFormComponent, { size: 'xl' });
    this.addPlantDevice();
    this.updatePlantDevice();
  }
  addPlantDevice() {
    this.ref.componentInstance.addDevice.subscribe((data: any) => {
      this.plantDeviceService
        .addPlantDevice({
          id: 0,
          plantId: this.plantId,
          ...data,
        })
        .subscribe(() => this.refreshList(this.plantId));
    });
  }
  updatePlantDevice() {
    this.ref.componentInstance.updateDevice.subscribe((data: any) => {
      this.plantDeviceService
        .updatePlantDevice({
          id: this.deviceId,
          plantId: this.plantId,
          ...data,
        })
        .subscribe(() => this.refreshList(this.plantId));
    });
  }

  prepareGrid() {
    this.columnDefinitions = [
      {
        id: 'nameDevice',
        name: 'Наименование измерительного прибора',
        field: 'nameDevice',
        filterable: true,
        sortable: true,
      },
      {
        id: 'identificationNumber',
        name: 'Расположение',
        field: 'identificationNumber',
        filterable: true,
        sortable: true,
      },
      {
        id: 'unitDevice',
        name: 'единица измерений',
        field: 'unitDevice',
        filterable: true,
        sortable: true,
      },
      {
        id: 'lowerLimit',
        name: 'нижний предел',
        field: 'lowerLimit',
        filterable: true,
        sortable: true,
      },
      {
        id: 'upperLimit',
        name: 'верхний предел',
        field: 'upperLimit',
        filterable: true,
        sortable: true,
      },
      {
        id: 'specifiedUncertainty',
        name: 'Указанная неопределенность',
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
          this.deviceId = args.dataContext.id;
          this.openPlantDeviceModal();
          this.ref.componentInstance.editForm(this.deviceId);
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
          const id = args.dataContext.id;
          if (confirm('Уверены ли вы?')) {
            this.plantDeviceService
              .deletePlantDevice(id)
              .subscribe(() => this.refreshList(this.plantId));
          }
        },
      },
    ];

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
    };
  }
}
