import { ReportProductModel } from './../../../models/report-product.model';
import { Component, OnInit } from '@angular/core';
import {
  AngularGridInstance,
  Column,
  Editors,
  FieldType,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute } from '@angular/router';
import { ReportProductService } from '../../../services/report-product.service';
@Component({
  selector: 'app-report-product',
  templateUrl: './report-product.component.html',
  styleUrls: ['./report-product.component.css'],
})
export class ReportProductComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: ReportProductModel[] = [];
  cadasterId!: number;
  gridObj: any;
  dataViewObj: any;
  isExcludingChildWhenFiltering = false;
  isAutoApproveParentItemWhenTreeColumnIsValid = true;
  dicUnitList: any[] = [];

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
    this.dataViewObj.getItemMetadata = (row: any) => {
      const newCssClass = 'bg-secondary bg-opacity-50 text-white';
      const item = this.dataViewObj.getItem(row);
      if (item.__hasChildren) {
        return {
          cssClasses: newCssClass,
        };
      } else {
        return '';
      }
    };
    this.gridObj.onBeforeEditCell.subscribe((e: any, args: any) => {
      if (args.item.__hasChildren) {
        return false;
      }
      return true;
    });
  }
  constructor(private reportProductService: ReportProductService) {}

  ngOnInit(): void {
    this.prepareGrid();
  }

  anyFunction(id: number) {
    this.refreshList(id);
  }
  refreshList(reportId: number) {
    this.reportProductService
      .getReportProductById(reportId)
      .subscribe((data) => {
        this.dataset = data;
      });
  }

  prepareGrid() {
    this.columnDefinitions = [
      {
        id: 'productName',
        name: 'Вид продукции',
        field: 'productName',
        filterable: true,
        sortable: true,
      },
      {
        id: 'productVolume',
        name: 'Объем продукции',
        field: 'productVolume',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const productVolume = args.dataContext.productVolume;
          const data = {
            id,
            nameField: 'ProductVolume',
            valueField: productVolume.toString(),
          };
          this.reportProductService
            .addReportProduct(data)
            .subscribe((res: any) => {});
        },
      },
      {
        id: 'unitName',
        name: 'Ед. измерение',
        field: 'unitName',
        filterable: true,
        sortable: true,
      },
      {
        id: 'productCarbonDioxide',
        name: 'Двуокись углерода',
        field: 'productCarbonDioxide',
        columnGroup:
          'Объем выбросов парниковых газов (в эквиваленте тонны двуокиси углерода)*',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const productCarbonDioxide = args.dataContext.productCarbonDioxide;
          const data = {
            id,
            nameField: 'ProductCarbonDioxide',
            valueField: productCarbonDioxide.toString(),
          };
          this.reportProductService
            .addReportProduct(data)
            .subscribe((res: any) => {});
        },
      },
      {
        id: 'productMethane',
        name: 'Метан',
        field: 'productMethane',
        columnGroup:
          'Объем выбросов парниковых газов (в эквиваленте тонны двуокиси углерода)*',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const productMethane = args.dataContext.productMethane;
          const data = {
            id,
            nameField: 'ProductMethane',
            valueField: productMethane.toString(),
          };
          this.reportProductService
            .addReportProduct(data)
            .subscribe((res: any) => {});
        },
      },
      {
        id: 'productNitrousOxide',
        name: 'Закись азота',
        field: 'productNitrousOxide',
        columnGroup:
          'Объем выбросов парниковых газов (в эквиваленте тонны двуокиси углерода)*',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const productNitrousOxide = args.dataContext.productNitrousOxide;
          const data = {
            id,
            nameField: 'ProductNitrousOxide',
            valueField: productNitrousOxide.toString(),
          };
          this.reportProductService
            .addReportProduct(data)
            .subscribe((res: any) => {});
        },
      },

      {
        id: 'productPerfluorocarbons',
        name: 'Перфторуглероды',
        field: 'productPerfluorocarbons',
        columnGroup:
          'Объем выбросов парниковых газов (в эквиваленте тонны двуокиси углерода)*',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const productPerfluorocarbons =
            args.dataContext.productPerfluorocarbons;
          const data = {
            id,
            nameField: 'ProductPerfluorocarbons',
            valueField: productPerfluorocarbons.toString(),
          };
          this.reportProductService
            .addReportProduct(data)
            .subscribe((res: any) => {});
        },
      },
    ];

    this.gridOptions = {
      autoResize: {
        container: '#demo-container',
      },
      gridWidth: '100%',
      enableAutoSizeColumns: true,
      enableAutoResize: true,
      enableExcelExport: true,
      excelExportOptions: {
        exportWithFormatter: true,
        sanitizeDataExport: true,
      },

      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
      headerRowHeight: 45,
      rowHeight: 45, // increase row height so that the ng-select fits in the cell
      editable: true,
      enableCellMenu: true,
      enableCellNavigation: true,
      enableColumnPicker: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,

      autoEdit: true,
      autoCommitEdit: true,

      enableGrouping: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,

      contextMenu: {
        iconCollapseAllGroupsCommand: 'mdi mdi-arrow-collapse',
        iconExpandAllGroupsCommand: 'mdi mdi-arrow-expand',
        iconClearGroupingCommand: 'mdi mdi-close',
        iconCopyCellValueCommand: 'mdi mdi-content-copy',
        iconExportCsvCommand: 'mdi mdi-download',
        iconExportExcelCommand: 'mdi mdi-file-excel-outline',
        iconExportTextDelimitedCommand: 'mdi mdi-download',
      },
      gridMenu: {
        iconCssClass: 'mdi mdi-menu',
        iconClearAllFiltersCommand: 'mdi mdi-filter-remove-outline',
        iconClearAllSortingCommand: 'mdi mdi-swap-vertical',
        iconExportCsvCommand: 'mdi mdi-download',
        iconExportExcelCommand: 'mdi mdi-file-excel-outline',
        iconExportTextDelimitedCommand: 'mdi mdi-download',
        iconRefreshDatasetCommand: 'mdi mdi-sync',
        iconToggleFilterCommand: 'mdi mdi-flip-vertical',
        iconTogglePreHeaderCommand: 'mdi mdi-flip-vertical',
      },
      headerMenu: {
        iconClearFilterCommand: 'mdi mdi mdi-filter-remove-outline',
        iconClearSortCommand: 'mdi mdi-swap-vertical',
        iconSortAscCommand: 'mdi mdi-sort-ascending',
        iconSortDescCommand: 'mdi mdi-flip-v mdi-sort-descending',
        iconColumnHideCommand: 'mdi mdi-close',
      },
    };
  }
}
