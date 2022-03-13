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
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../confirm-dialog/confirm-dialog.component'
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
    private dialog: MatDialog,
    private plantProductService: PlantProductService,
    private plantService: PlantService,
    private translate: TranslateService,
  ) {}

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
    this.plantProductService
      .getPlantProductList(id)
      .subscribe((product) => (this.dataset = product))
  }

  openProductDialog() {
    this.ref = this.dialog.open(PlantProductFormComponent, {
      width: '800px',
      position: {
        top: '100px',
      },
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

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row)
    this.plantProductId = item.id
  }

  prepareGrid() {
    this.translate.get('PLANT.PRODUCT.FORM').subscribe((translations: any) => {
      this.columnDefinitions = [
        {
          id: 'dicProductName',
          name: translations['PRODUCT_NAME'],
          field: 'dicProductName',
          filterable: true,
          sortable: true,
        },

        {
          id: 'dicUnitName',
          name: translations['DIC_UNIT'],
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
            this.openProductDialog()
            this.ref.componentInstance.editForm(this.plantProductId)
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
                this.plantProductService
                  .deletePlantProduct(id)
                  .subscribe(() => {
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
