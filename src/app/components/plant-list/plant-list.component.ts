import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AngularGridInstance,
  Column,
  FieldType,
  Formatters,
  GridOption,
  OnEventArgs,
  Subscription,
} from 'angular-slickgrid';
import { PlantModel } from 'src/app/models/plant.model';
import { PlantService } from 'src/app/services/plant.service';
import { PlantFormComponent } from './plant-form/plant-form.component';

@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.css'],
})
export class PlantListComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  plantId!: number;
  gridObj: any;
  dataViewObj: any;
  modalRef: any;
  plantRoute: any[] = [];
  onDatePickedSub!: Subscription;

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }
  constructor(
    private plantService: PlantService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.prepareGrid();
    this.refreshList();
    this.plantRoute = [
      {
        id: 1,
        name: 'source',
        title: 'Источники',
      },

      {
        id: 2,
        name: 'process',
        title: 'Процессы',
      },
      {
        id: 3,
        name: 'sampling',
        title: 'Отбор проб',
      },
      {
        id: 4,
        name: 'device',
        title: 'Приборы',
      },
      {
        id: 5,
        name: 'product',
        title: 'Продукты',
      },
    ];
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.plantId = item.id;
    this.plantService.plantIdRefreshList.next(item);
  }
  onActivate(componentReference: any) {
    if (this.plantId !== undefined) {
      componentReference.anyFunction(this.plantId);
    }
  }
  refreshList() {
    this.plantService.getPlantList(1).subscribe((data) => {
      this.dataset = data;
    });
  }

  openPlantModal() {
    this.modalRef = this.modalService.open(PlantFormComponent, {
      size: 'xl',
    });
    this.addPlant();
    this.updatePlant();
  }
  addPlant() {
    this.modalRef.componentInstance.addPlant.subscribe((data: PlantModel) => {
      this.plantService.addPlant({ id: 0, ...data }).subscribe(() => {
        this.refreshList();
      });
    });
  }
  updatePlant() {
    this.modalRef.componentInstance.updatePlant.subscribe(
      (data: PlantModel) => {
        this.plantService
          .updatePlant({ id: this.plantId, ...data })
          .subscribe(() => {
            this.refreshList();
          });
      }
    );
  }
  prepareGrid() {
    this.columnDefinitions = [
      {
        id: 'namePlant',
        name: 'Наименование установки',
        field: 'namePlant',
        filterable: true,
        sortable: true,
      },
      {
        id: 'oblastName',
        name: 'Область',
        field: 'oblastName',
        filterable: true,
        sortable: true,
      },
      {
        id: 'regionName',
        name: 'Город',
        field: 'regionName',
        filterable: true,
        sortable: true,
      },

      // {
      //   id: 'note',
      //   name: 'Описание',
      //   field: 'note',
      // },
      {
        id: 'address',
        name: 'Географическое место',
        field: 'address',
        filterable: true,
        sortable: true,
      },
      {
        id: 'inactive',
        name: 'Активен',
        field: 'inactive',
        minWidth: 100,
        maxWidth: 100,
        type: FieldType.boolean,
        sortable: true,
        exportCustomFormatter: Formatters.complexObject,
        formatter: Formatters.multiple,
        params: {
          formatters: [Formatters.checkmark],
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
          this.openPlantModal();
          this.modalRef.componentInstance.editForm(this.plantId);
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
            this.plantService.deletePlant(id).subscribe(() => {
              this.refreshList();
            });
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
      gridHeight: 200,
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
      enableCheckboxSelector: true,
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
