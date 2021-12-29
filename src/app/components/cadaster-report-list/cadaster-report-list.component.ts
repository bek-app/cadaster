import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { CadasterReportModel } from 'src/app/models/cadaster-report.model';
import { CadasterReportService } from 'src/app/services/cadaster-report.service';

import { PlantService } from 'src/app/services/plant.service';
import { CadasterReportFormComponent } from './cadaster-report-form/cadaster-report-form.component';
@Component({
  selector: 'app-cadaster-report-list',
  templateUrl: './cadaster-report-list.component.html',
  styleUrls: ['./cadaster-report-list.component.css'],
})
export class CadasterReportListComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: CadasterReportModel[] = [];
  cadasterId!: number;
  gridObj: any;
  dataViewObj: any;
  modalRef: any;

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }
  constructor(
    private modalService: NgbModal,
    private cadasterService: CadasterReportService
  ) {}

  ngOnInit(): void {
    this.prepareGrid();
    this.refreshList();
  }

  refreshList() {
    this.cadasterService.getCadasterReportList(0).subscribe((data) => {
      this.dataset = data;
    });
  }

  openCadasterModal() {
    this.modalRef = this.modalService.open(CadasterReportFormComponent, {
      size: 'xl',
    });
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

      {
        id: 'address',
        name: 'Географическое место',
        field: 'address',
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
          this.cadasterId = args.dataContext.id;
          this.openCadasterModal();
          this.modalRef.componentInstance.editForm(this.cadasterId);
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
            this.cadasterService.deleteCadasterReport(id).subscribe(() => {
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
