import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router, RouterLinkActive } from '@angular/router'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { TranslateService } from '@ngx-translate/core'
import {
  AngularGridInstance,
  Column,
  FieldType,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid'
import { PlantModel } from 'src/app/models/plant.model'
import { PlantService } from 'src/app/services/plant.service'
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../confirm-dialog/confirm-dialog.component'
import { PlantFormComponent } from './plant-form/plant-form.component'

@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.css'],
})
export class PlantListComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  plantId!: number
  gridObj: any
  dataViewObj: any
  modalRef: any
  plantRoute: any[] = []
  faPlus = faPlus
  activeLink = this.plantRoute[0]
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.gridObj = angularGrid.slickGrid
    this.dataViewObj = angularGrid.dataView
  }

  constructor(
    private plantService: PlantService,
    private dialog: MatDialog,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.translate.get('PLANT.MENU').subscribe((translations: any) => {
      const {
        SOURCE,
        PROCESS,
        SAMPLING,
        DEVICE,
        PRODUCT,
        PLANNED_CHANGES,
        ACTIVITY,
      } = translations

      this.plantRoute = [
        {
          src: 'source',
          name: SOURCE,
        },

        {
          src: 'process',
          name: PROCESS,
        },
        {
          src: 'sampling',
          name: SAMPLING,
        },
        {
          src: 'device',
          name: DEVICE,
        },
        {
          src: 'planned-changes',
          name: PLANNED_CHANGES,
        },
        {
          src: 'product',
          name: PRODUCT,
        },
        {
          src: 'activity',
          name: ACTIVITY,
        },
      ]
    })

    this.prepareGrid()
    this.refreshList()
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row)
    this.plantId = item.id
    this.plantService.plantIdRefreshList.next(item)
  }

  onActivate(componentReference: any) {
    if (this.plantId !== undefined) {
      componentReference.goToPlants(this.plantId)
    }
  }

  refreshList() {
    this.plantService.getPlantList(1).subscribe((data) => {
      this.dataset = data
    })
  }

  openPlantDialog() {
    this.modalRef = this.dialog.open(PlantFormComponent, {
      width: '700px',
    })

    this.addPlant()
    this.updatePlant()
  }

  addPlant() {
    this.modalRef.componentInstance.addPlant.subscribe((data: PlantModel) => {
      this.plantService.addPlant({ id: 0, ...data }).subscribe(() => {
        this.refreshList()
        this.modalRef.close()
      })
    })
  }

  updatePlant() {
    this.modalRef.componentInstance.updatePlant.subscribe(
      (data: PlantModel) => {
        this.plantService
          .updatePlant({ id: this.plantId, ...data })
          .subscribe(() => {
            this.refreshList()
            this.modalRef.close()
          })
      },
    )
  }

  prepareGrid() {
    this.translate.get('PLANT').subscribe((translations: any) => {
      const { FORM }: any = translations
      const { NAME, OBLAST, REGION, ADDRESS, INACTIVE } = FORM
      this.columnDefinitions = [
        {
          id: 'namePlant',
          name: NAME,
          field: 'namePlant',
          filterable: true,
          sortable: true,
        },
        {
          id: 'oblastName',
          name: OBLAST,
          field: 'oblastName',
          filterable: true,
          sortable: true,
        },
        {
          id: 'regionName',
          name: REGION,
          field: 'regionName',
          filterable: true,
          sortable: true,
        },

        {
          id: 'address',
          name: ADDRESS,
          field: 'address',
          filterable: true,
          sortable: true,
        },
        {
          id: 'inactive',
          name: INACTIVE,
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
          id: 'view',
          field: 'id',
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
          minWidth: 30,
          maxWidth: 30,
          formatter: () => `<span class="mdi mdi-loupe"></span>`,
          onCellClick: (e: Event, args: OnEventArgs) => {
            this.openPlantDialog()
            this.modalRef.componentInstance.editForm(this.plantId)
            this.modalRef.componentInstance.form.disable()
            this.modalRef.componentInstance.viewMode = true
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
            this.openPlantDialog()
            this.modalRef.componentInstance.editForm(this.plantId)
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
                this.plantService.deletePlant(id).subscribe(() => {
                  this.refreshList()
                })
              }
            })
          },
        },
      ]
    })
    this.gridOptions = {
      gridHeight: 250,
      enableCheckboxSelector: true,
      enableRowSelection: true,
    }
  }
}
