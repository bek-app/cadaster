import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { CadasterReportFormComponent } from './cadaster-report-form/cadaster-report-form.component';
@Component({
  selector: 'app-cadaster-report',
  templateUrl: './cadaster-report.component.html',
  styleUrls: ['./cadaster-report.component.css'],
})
export class CadasterReportComponent implements OnInit {
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
    private cadasterService: CadasterReportService,
    private router: Router,
    private route: ActivatedRoute
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
        filterable: true,
        sortable: true,
      },
      {
        id: 'action',
        field: 'action',
        width: 30,
        minWidth: 30,
        maxWidth: 50,
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter:
          () => `<div class='d-flex justify-content-center' style='width: 35px; cursor: pointer'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-info-square' viewBox='0 0 16 16'>
        <path d='M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z'/>
        <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z'/>
      </svg> </div>`,
        onCellClick: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          this.router.navigate(['/cadaster-report-list', id], {
            relativeTo: this.route,
          });
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
