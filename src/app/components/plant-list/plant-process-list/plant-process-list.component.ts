import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { Dictionary } from 'src/app/models/dictionary.model';
import { PlantProcessModel } from 'src/app/models/plant-process.model ';
import { PlantService } from 'src/app/services/plant.service';
import { PlantProcessService } from '../../../services/plant-process.service';
import { ProcessFormComponent } from './process-form/process-form.component';
@Component({
  selector: 'app-plant-process-list',
  templateUrl: './plant-process-list.component.html',
  styleUrls: ['./plant-process-list.component.css'],
})
export class PlantProcessListComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: PlantProcessModel[] = [];
  plantId!: number;
  processId!: number;
  gridObj: any;
  dataViewObj: any;
  isActive = false;
  submitted = false;
  namePlant!: string
  dicProcessList: Dictionary[] = [];
  @ViewChild('content') content: any;
  ref: any;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private plantProcessDialog: MatDialog,
    private plantProcessService: PlantProcessService,
    private plantService: PlantService
  ) { }

  ngOnInit(): void {
    this.plantService.plantIdRefreshList.subscribe((item: any) => {
      this.plantId = item.id;
      // this.namePlant = item.namePlant;
      this.refreshList(this.plantId);
    });
    this.prepareGrid();
  }

  refreshList(id: number) {
    this.plantProcessService
      .getPlantProcessList(id)
      .subscribe((data) => (this.dataset = data));
  }

  goToPlants(id: number) {
    this.plantId = id;
    this.refreshList(id);
  }

  openProcessFormDialog() {
    this.ref = this.plantProcessDialog.open(ProcessFormComponent, {
      width: "800px"
    });
    this.addProcess();
    this.updateProcess();
  }

  addProcess() {
    this.ref.componentInstance.addProcess.subscribe((data: any) => {
      this.plantProcessService
        .addPlantProcess({ id: 0, plantId: this.plantId, ...data })
        .subscribe(() => {
          this.ref.close();
          this.refreshList(this.plantId)
        });
    });
  }

  updateProcess() {
    this.ref.componentInstance.updateProcess.subscribe((data: any) => {
      this.plantProcessService
        .updatePlantProcess({
          id: this.processId,
          plantId: this.plantId,
          ...data,
        })
        .subscribe(() => { this.ref.close(); this.refreshList(this.plantId) });
    });
  }

  prepareGrid() {
    this.columnDefinitions = [
      {
        id: 'processName',
        name: 'Наименование производственного процесса',
        field: 'processName',
        filterable: true,
        sortable: true,
      },
      {
        id: 'subProccessNames',
        name: 'Наименование производственного подпроцесса',
        field: 'subProccessNames',
        filterable: true,
        sortable: true,
      },
      {
        id: 'materialNames',
        name: 'Наименование топлива или сырья',
        field: 'materialNames',
        filterable: true,
        sortable: true,
      },
      {
        id: 'oddsLevel',
        name: 'Уровень коэффициентов выбросов парниковых газов',
        field: 'oddsLevel',
        filterable: true,
        sortable: true,
      },

      {
        id: 'amountConsumed',
        name: 'Источник данных о количестве потребляемого топлива или сырья',
        field: 'amountConsumed',
        filterable: true,
        sortable: true,
      },
      {
        id: 'calculatingCalorific',
        name: 'низшей теплоты сгорания',
        columnGroup: 'Источник данных для расчета коэффициента ',
        field: 'calculatingCalorific',
        filterable: true,
        sortable: true,
      },
      {
        id: 'calculatingConversion',
        name: 'преобразования (в случае промышленных процессов) ',
        columnGroup: 'Источник данных для расчета коэффициента ',
        field: 'calculatingConversion',
        filterable: true,
        sortable: true,
      },
      {
        id: 'calculatingCarbon',
        name: 'содержания углерода ',
        columnGroup: 'Источник данных для расчета коэффициента ',
        field: 'calculatingCarbon',
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
          this.processId = args.dataContext.id;
          this.openProcessFormDialog();
          this.ref.componentInstance.editForm(this.processId);
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
            this.plantProcessService
              .deletePlantProcess(id)
              .subscribe(() => this.refreshList(this.plantId));
          }
        },
      },
    ];

    this.gridOptions = {
      autoResize: {
        container: '#demo-container',
      },
      enableCellNavigation: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 25,
      explicitInitialization: true,
      enableAutoSizeColumns: true,
      enableAutoResize: true,
      gridWidth: '100%',
      enableFiltering: true,
      enableSorting: true,
      editable: true,
      autoEdit: true,
      autoCommitEdit: true,
      enableTranslate: true,
      enableColumnReorder: false,
      enableColumnPicker: false,
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
