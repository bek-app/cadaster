import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  Observable,
  OnEventArgs,
} from 'angular-slickgrid';
import { PlantSourceModel } from 'src/app/models/plant-source.model';
import { PlantSourceService } from 'src/app/services/plant-source.service';
import { PlantService } from 'src/app/services/plant.service';
import { SourceFormComponent } from './source-form/source-form.component';
@Component({
  selector: 'app-plant-source-list',
  templateUrl: './plant-source-list.component.html',
  styleUrls: ['./plant-source-list.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class PlantSourceListComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  plantId!: number;
  plantSourceId!: number;
  gridObj: any;
  dataViewObj: any;
  ref: any;
  namePlant!: string;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }
  constructor(
    private modalService: NgbModal,
    config: NgbModalConfig,
    private plantSourceService: PlantSourceService,
    private plantService: PlantService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit(): void {
    this.prepareGrid();
    this.plantService.plantIdRefreshList.subscribe((item: any) => {
      this.plantId = item.id;
      // this.namePlant = item.namePlant;
      this.refreshList(this.plantId);
    });
  }

  anyFunction(id: number) {
    this.plantId = id;
    this.refreshList(id);
  }

  refreshList(id: number) {
    this.plantSourceService.getPlantSourceList(id).subscribe((data) => {
      this.dataset = data;
    });
  }
  openPlantSourceModal() {
    this.ref = this.modalService.open(SourceFormComponent, { size: 'xl' });
    this.onPlantSourceAdded();
    this.onPlantSourceUpdated();
  }
  onPlantSourceAdded() {
    this.ref.componentInstance.onPlantSourceAdded.subscribe(
      (data: PlantSourceModel) => {
        const newData = { id: 0, plantId: this.plantId, ...data };
        this.plantSourceService.addPlantSource(newData).subscribe((data) => {
          this.refreshList(this.plantId);
          console.log(data);
        });
      }
    );
  }

  onPlantSourceUpdated() {
    this.ref.componentInstance.onPlantSourceUpdated.subscribe(
      (data: PlantSourceModel) => {
        const newData = {
          id: this.plantSourceId,
          plantId: this.plantId,
          ...data,
        };
        this.plantSourceService.updatePlantSource(newData).subscribe((data) => {
          this.refreshList(this.plantId);
        });
      }
    );
  }

  prepareGrid() {
    this.columnDefinitions = [
      {
        id: 'nameSource',
        name: 'Наименование источника',
        field: 'nameSource',
        filterable: true,
        sortable: true,
      },
      {
        id: 'characteristic',
        name: 'Характеристика используемой технологии ',
        field: 'characteristic',
        filterable: true,
        sortable: true,
      },
      {
        id: 'installedCapacity',
        name: 'Установленная мощность  (единицы измерения)    (при наличии) ',
        field: 'installedCapacity',
        filterable: true,
        sortable: true,
      },

      {
        id: 'workinHours',
        name: 'Время работы',
        field: 'workinHours',
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
          this.plantSourceId = args.dataContext.id;
          this.openPlantSourceModal();
          this.ref.componentInstance.editForm(this.plantSourceId);
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
            this.plantSourceService.deletePlantSource(id).subscribe((data) => {
              this.refreshList(this.plantId);
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
