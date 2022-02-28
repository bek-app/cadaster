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
import { PlantSourceModel } from 'src/app/models/plant-source.model'
import { PlantSourceService } from 'src/app/services/plant-source.service'
import { PlantService } from 'src/app/services/plant.service'
import { SourceFormComponent } from './source-form/source-form.component'
@Component({
  selector: 'app-plant-source-list',
  templateUrl: './plant-source-list.component.html',
  styleUrls: ['./plant-source-list.component.css'],
})
export class PlantSourceListComponent implements OnInit {
  angularGrid!: AngularGridInstance
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  plantId!: number
  plantSourceId!: number
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
    private plantSourceDialog: MatDialog,
    private plantSourceService: PlantSourceService,
    private plantService: PlantService,
    private translate: TranslateService,
  ) {}
  ngOnInit(): void {
    this.prepareGrid()
    this.plantService.plantIdRefreshList.subscribe((item: any) => {
      this.plantId = item.id
      // this.namePlant = item.namePlant;
      this.refreshList(this.plantId)
    })
  }

  goToPlants(id: number) {
    this.plantId = id
    this.refreshList(id)
  }

  refreshList(id: number) {
    this.plantSourceService.getPlantSourceList(id).subscribe((data) => {
      this.dataset = data
    })
  }
  openPlantSourceDialog() {
    this.ref = this.plantSourceDialog.open(SourceFormComponent, {})
    this.onPlantSourceAdded()
    this.onPlantSourceUpdated()
  }
  onPlantSourceAdded() {
    this.ref.componentInstance.onPlantSourceAdded.subscribe(
      (data: PlantSourceModel) => {
        const newData = { id: 0, plantId: this.plantId, ...data }
        this.plantSourceService
          .addPlantSource(newData)
          .subscribe((res) => this.refreshList(this.plantId))
      },
    )
  }

  onPlantSourceUpdated() {
    this.ref.componentInstance.onPlantSourceUpdated.subscribe(
      (data: PlantSourceModel) => {
        const newData = {
          id: this.plantSourceId,
          plantId: this.plantId,
          ...data,
        }
        this.plantSourceService
          .updatePlantSource(newData)
          .subscribe((res) => this.refreshList(this.plantId))
      },
    )
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row)
    this.plantSourceId = item.id
  }

  prepareGrid() {
    this.translate.get('PLANT.SOURCE').subscribe((translations: any) => {
      this.columnDefinitions = [
        {
          id: 'nameSource',
          name: translations['NAME_SOURCE'],
          field: 'nameSource',
          filterable: true,
          sortable: true,
        },
        {
          id: 'characteristic',
          name: translations['CHARACTERISTIC'],
          field: 'characteristic',
          filterable: true,
          sortable: true,
        },
        {
          id: 'installedCapacity',
          name: translations['INSTALLED_CAPACITY'],
          field: 'installedCapacity',
          filterable: true,
          sortable: true,
        },

        {
          id: 'workinHours',
          name: translations['WORKINHOURS'],
          field: 'workinHours',
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
            this.openPlantSourceDialog()
            this.ref.componentInstance.editForm(this.plantSourceId)
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
            this.openPlantSourceDialog()
            this.ref.componentInstance.editForm(this.plantSourceId)
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
              this.plantSourceService
                .deletePlantSource(id)
                .subscribe((data) => {
                  this.refreshList(this.plantId)
                })
            }
          },
        },
      ]
    })
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
