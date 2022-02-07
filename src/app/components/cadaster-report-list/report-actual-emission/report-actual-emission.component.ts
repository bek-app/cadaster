import { Component, OnInit } from '@angular/core';
import {
  AngularGridInstance,
  AngularUtilService,
  Column,
  Editors,
  FieldType,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActualEmissionService } from '../../../services/actual-emission.service';
import { reportCadasterTreeFormatter } from '../../formatters/reportCadasterTreeFormatter';
@Component({
  selector: 'app-report-actual-emission',
  templateUrl: './report-actual-emission.component.html',
  styleUrls: ['./report-actual-emission.component.css'],
})
export class ReportActualEmissionComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  gridObj: any;
  dataViewObj: any;
  actualEmissionId!: number;
  isExcludingChildWhenFiltering = false;
  isAutoApproveParentItemWhenTreeColumnIsValid = true;
  editMode = false;
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
  constructor(
    private angularUtilService: AngularUtilService,
    private actualEmissionService: ActualEmissionService
  ) {}

  ngOnInit(): void {
    this.prepareGrid();
    this.refreshList(4);
  }

  goToCadasterReports(id: number) {
    this.actualEmissionId = id;
    this.refreshList(id);
  }
  refreshList(reportId: number) {
    this.actualEmissionService
      .getActualEmissionById(reportId)
      .subscribe((data) => {
        data.forEach((items) => {
          items.materials.forEach((material: any) => {
            Object.assign(material, {
              processName: material.dicMaterialName,
            });
          });
        });
        this.dataset = data;
      });
  }
  addGridService(data: any) {
    this.angularGrid.gridService.addItem(
      { ...data },
      {
        highlightRow: false,
      }
    );
  }
  prepareGrid() {
    this.columnDefinitions = [
      {
        id: 'processName',
        name: 'Наименование процесса',
        field: 'processName',
        type: FieldType.string,
        width: 120,
        formatter: reportCadasterTreeFormatter,
        filterable: true,
        sortable: true,
      },

      {
        id: 'carbonDioxide',
        name: ' Объем выбросов двуокиси углерода,тонн',
        field: 'carbonDioxide',
        filterable: true,
        sortable: true,
        type: FieldType.string,
        editor: {
          model: Editors.longText,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const carbonDioxide = args.dataContext.carbonDioxide;
          const data = {
            id,
            nameField: 'CarbonDioxide',
            valueField: carbonDioxide,
          };
          this.actualEmissionService
            .addActualEmission(data)
            .subscribe((res) => this.refreshList(this.actualEmissionId));
        },
      },
      {
        id: 'methaneEmissionsTon',
        name: 'тонн',
        field: 'methaneEmissionsTon',
        columnGroup: 'Объем выбросов метана',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const methaneEmissionsTon = args.dataContext.methaneEmissionsTon;
          const data = {
            id,
            nameField: 'MethaneEmissionsTon',
            valueField: methaneEmissionsTon.toString(),
          };
          this.actualEmissionService
            .addActualEmission(data)
            .subscribe((res) => this.refreshList(this.actualEmissionId));
        },
      },
      {
        id: 'methaneEmissionsCo2',
        name: 'в эквиваленте тонны двуокиси углерода',
        field: 'methaneEmissionsCo2',
        columnGroup: 'Объем выбросов метана',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const methaneEmissionsCo2 = args.dataContext.methaneEmissionsCo2;
          const data = {
            id,
            nameField: 'MethaneEmissionsCo2',
            valueField: methaneEmissionsCo2.toString(),
          };
          this.actualEmissionService
            .addActualEmission(data)
            .subscribe((res) => this.refreshList(this.actualEmissionId));
        },
      },

      {
        id: 'nitrousOxideTon',
        name: 'тонн',
        field: 'nitrousOxideTon',
        columnGroup: 'Объем выбросов закиси азота',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const nitrousOxideTon = args.dataContext.nitrousOxideTon;
          const data = {
            id,
            nameField: 'NitrousOxideTon',
            valueField: nitrousOxideTon.toString(),
          };
          this.actualEmissionService
            .addActualEmission(data)
            .subscribe((res) => this.refreshList(this.actualEmissionId));
        },
      },
      {
        id: 'nitrousOxideCo2',
        name: 'в эквиваленте тонны двуокиси углерода',
        field: 'nitrousOxideCo2',
        columnGroup: 'Объем выбросов закиси азота',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const nitrousOxideCo2 = args.dataContext.nitrousOxideCo2;
          const data = {
            id,
            nameField: 'NitrousOxideCo2',
            valueField: nitrousOxideCo2.toString(),
          };
          this.actualEmissionService
            .addActualEmission(data)
            .subscribe((res) => this.refreshList(this.actualEmissionId));
        },
      },
      {
        id: 'perfluorocarbonTon',
        name: 'тонн',
        field: 'perfluorocarbonTon',
        columnGroup: 'Объем выбросов перфторуглеродов',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const perfluorocarbonTon = args.dataContext.perfluorocarbonTon;
          const data = {
            id,
            nameField: 'PerfluorocarbonTon',
            valueField: perfluorocarbonTon.toString(),
          };
          this.actualEmissionService
            .addActualEmission(data)
            .subscribe((res) => this.refreshList(this.actualEmissionId));
        },
      },
      {
        id: 'perfluorocarbonCo2',
        name: 'в эквиваленте тонны двуокиси углерода',
        field: 'perfluorocarbonCo2',
        columnGroup: 'Объем выбросов перфторуглеродов',

        filterable: true,
        sortable: true,
        type: FieldType.number,
        editor: { model: Editors.integer },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const perfluorocarbonCo2 = args.dataContext.perfluorocarbonCo2;
          const data = {
            id,
            nameField: 'PerfluorocarbonCo2',
            valueField: perfluorocarbonCo2.toString(),
          };
          this.actualEmissionService
            .addActualEmission(data)
            .subscribe((res) => this.refreshList(this.actualEmissionId));
        },
      },

      {
        id: 'totalCo2',
        name: 'totalCo2',
        field: 'totalCo2',
        filterable: true,
        sortable: true,
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
      autoEdit: true,
      autoCommitEdit: true,
      enableCellNavigation: true,
      editable: true,
      enableFiltering: true,
      enableGrouping: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      enableTreeData: true, // you must enable this flag for the filtering & sorting to work as expected
      multiColumnSort: false, // multi-column sorting is not supported with Tree Data, so you need to disable it
      treeDataOptions: {
        columnId: 'processName',
        childrenPropName: 'materials',
        excludeChildrenWhenFilteringTree: this.isExcludingChildWhenFiltering, // defaults to false

        autoApproveParentItemWhenTreeColumnIsValid:
          this.isAutoApproveParentItemWhenTreeColumnIsValid,
      },
      params: {
        angularUtilService: this.angularUtilService, // provide the service to all at once (Editor, Filter, AsyncPostRender)
      },

      // change header/cell row height for salesforce theme
      headerRowHeight: 45,
      rowHeight: 45,
      showCustomFooter: true,

      // we can also preset collapsed items via Grid Presets (parentId: 4 => is the "pdf" folder)
      presets: {
        treeData: { toggledItems: [{ itemId: 4, isCollapsed: true }] },
      },
      // use Material Design SVG icons
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
  renderAngularComponent(
    cellNode: HTMLElement,
    row: number,
    dataContext: any,
    colDef: Column
  ) {
    if (colDef.params.component) {
      const componentOutput = this.angularUtilService.createAngularComponent(
        colDef.params.component
      );
      Object.assign(componentOutput.componentRef.instance, {
        item: dataContext,
      });

      // use a delay to make sure Angular ran at least a full cycle and make sure it finished rendering the Component
      setTimeout(() => $(cellNode).empty().html(componentOutput.domElement));
    }
  }
}
