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
import { PlantProcessModel } from 'src/app/models/plant-process.model ';
import { PlantProductModel } from 'src/app/models/plant-product.model';
import { PlantSourceModel } from 'src/app/models/plant-source.model';
import { PlantProductService } from 'src/app/services/plant-product.service';
import { PlantSourceService } from 'src/app/services/plant-source.service';
import { PlantService } from 'src/app/services/plant.service';
import { SourceFormComponent } from '../plant-source-list/source-form/source-form.component';
import { PlantProductFormComponent } from './plant-product-form/plant-product-form.component';
@Component({
  selector: 'app-plant-product-list',
  templateUrl: './plant-product-list.component.html',
  styleUrls: ['./plant-product-list.component.css'],
})
export class PlantProductListComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: PlantProductModel[] = [];
  plantId!: number;
  plantProductId!: number;
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
    private plantProductService: PlantProductService,
    private plantService: PlantService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit(): void {
    this.prepareGrid();
    this.plantService.plantIdRefreshList.subscribe((item: any) => {
      this.plantId = item.id;
      this.refreshList(this.plantId);
    });
  }

  goToPlants(id: number) {
    this.plantId = id;
    this.refreshList(id);
  }

  refreshList(id: number) {
    this.plantProductService.getPlantProductList(id).subscribe((product) => {
      console.log(product);
      this.dataset = product;
    });
  }
  openPlantProductModal() {
    this.ref = this.modalService.open(PlantProductFormComponent, {
      size: 'lg',
    });
    this.onProductAdded();
    this.onProductUpdated();
  }
  onProductAdded() {
    this.ref.componentInstance.addProduct.subscribe(
      (data: PlantProductModel) => {
        const newData = { id: 0, plantId: this.plantId, ...data };
        this.plantProductService
          .addPlantProduct(newData)
          .subscribe((result) => this.refreshList(this.plantId));
      }
    );
  }

  onProductUpdated() {
    this.ref.componentInstance.updateProduct.subscribe(
      (data: PlantProductModel) => {
        const newData = {
          id: this.plantProductId,
          plantId: this.plantId,
          ...data,
        };
        this.plantProductService
          .updatePlantProduct(newData)
          .subscribe((result) => this.refreshList(this.plantId));
      }
    );
  }

  prepareGrid() {
    this.columnDefinitions = [
      {
        id: 'dicProductName',
        name: 'Вид',
        field: 'dicProductName',
        filterable: true,
        sortable: true,
      },
      {
        id: 'dicUnitName',
        name: 'Ед. измерения',
        field: 'dicUnitName',
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
          this.plantProductId = args.dataContext.id;
          this.openPlantProductModal();
          this.ref.componentInstance.editForm(this.plantProductId);
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
            this.plantProductService
              .deletePlantProduct(id)
              .subscribe((data) => {
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
