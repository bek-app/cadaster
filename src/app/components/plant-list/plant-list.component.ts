import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
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

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.gridObj = angularGrid.slickGrid
    this.dataViewObj = angularGrid.dataView
  }
  constructor(
    private plantService: PlantService,
    private plantDialog: MatDialog,
    private translate: TranslateService,
  ) {
    translate.get('PLANT').subscribe((translations: string) => {
      const { MENU, FORM }: any = translations
      const { NAME, OBLAST, REGION, ADDRESS, INACTIVE }: any = FORM
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
            if (confirm('Уверены ли вы?')) {
              this.plantService.deletePlant(id).subscribe(() => {
                this.refreshList()
              })
            }
          },
        },
      ]
      const {
        SOURCE,
        PROCESS,
        SAMPLING,
        DEVICE,
        PRODUCT,
        PLANNED_CHANGES,
      }: any = MENU
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
          src: 'product',
          name: PRODUCT,
        },
        {
          src: 'planned-changes',
          name: PLANNED_CHANGES,
        },
      ]
    })
  }

  ngOnInit(): void {
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
    this.modalRef = this.plantDialog.open(PlantFormComponent, {
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
    }
  }
}
