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
import { PlantProductModel } from 'src/app/models/plant-product.model'
import { PlantProductService } from 'src/app/services/plant-product.service'
import { PlantService } from 'src/app/services/plant.service'
import { PlantProductFormComponent } from './plant-product-form/plant-product-form.component'
@Component({
  selector: 'app-plant-product-list',
  templateUrl: './plant-product-list.component.html',
  styleUrls: ['./plant-product-list.component.css'],
})
export class PlantProductListComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: PlantProductModel[] = []
  plantId!: number
  plantProductId!: number
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
    private productFormDialog: MatDialog,
    private plantProductService: PlantProductService,
    private plantService: PlantService,
    private translate: TranslateService,
  ) {
    translate.get('PLANT.PRODUCT.FORM').subscribe((translations: string) => {
      this.columnDefinitions = [
        {
          id: 'dicProductName',
          name:  translations['PRODUCT_NAME' as any],
          field: 'dicProductName',
          filterable: true,
          sortable: true,
        },

        {
          id: 'dicUnitName',
          name:  translations['DIC_UNIT' as any],
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
            this.plantProductId = args.dataContext.id
            this.openProductDialog()

            this.ref.componentInstance.editForm(this.plantProductId)
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
              this.plantProductService
                .deletePlantProduct(id)
                .subscribe((data) => {
                  this.refreshList(this.plantId)
                })
            }
          },
        },
      ]
    })
  }

  ngOnInit(): void {
    this.prepareGrid()
    this.plantService.plantIdRefreshList.subscribe((item: any) => {
      this.plantId = item.id
      this.refreshList(this.plantId)
    })
  }

  goToPlants(id: number) {
    this.plantId = id
    this.refreshList(id)
  }

  refreshList(id: number) {
    this.plantProductService.getPlantProductList(id).subscribe((product) => {
      console.log(product)
      this.dataset = product
    })
  }

  openProductDialog() {
    this.ref = this.productFormDialog.open(PlantProductFormComponent, {
      width: '800px',
    })
    this.onProductAdded()
    this.onProductUpdated()
  }

  onProductAdded() {
    this.ref.componentInstance.addProduct.subscribe(
      (data: PlantProductModel) => {
        const newData = { id: 0, plantId: this.plantId, ...data }
        this.plantProductService
          .addPlantProduct(newData)
          .subscribe((result) => {
            this.refreshList(this.plantId)
            this.ref.close()
          })
      },
    )
  }

  onProductUpdated() {
    this.ref.componentInstance.updateProduct.subscribe(
      (data: PlantProductModel) => {
        const newData = {
          id: this.plantProductId,
          plantId: this.plantId,
          ...data,
        }
        this.plantProductService
          .updatePlantProduct(newData)
          .subscribe((result) => {
            this.refreshList(this.plantId)
            this.ref.close()
          })
      },
    )
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
