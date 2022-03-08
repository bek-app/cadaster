import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AngularGridInstance, Column, Formatters, GridOption, OnEventArgs } from 'angular-slickgrid';
import { UserModel } from 'src/app/models/administration/user.model';
import { PagedSortRequestModel } from 'src/app/models/general/page-sort-request.model';
import { UserService } from 'src/app/services/administration/user/user.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  angularGrid: AngularGridInstance | null = null;
  dataset: UserModel[] = [];
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  gridObj: any;
  dataViewObj: any;
  request: PagedSortRequestModel<any> = new PagedSortRequestModel<any>(0, 10, [], [], {});

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.prepareGrid()
    this.load()
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.gridObj = angularGrid.slickGrid
    this.dataViewObj = angularGrid.dataView
  }

  load() {
    this.userService.getList(this.request).subscribe((response) => {
      this.dataset = response.data;
    });
  }

  prepareGrid() {
    this.translate.get('ADMINISTRATION.USER').subscribe((translations: any) => {
      const {
        USER_NANE,
        LAST_NAME,
        FIRST_NAME,
        SECOND_NAME,
        PHONE_NUMBER,
        EMAIL,
        STATUS,
        ORGANIZATION
      }: any = translations

      this.columnDefinitions = [
        {
          id: 'userName',
          name: USER_NANE,
          field: 'userName',
          filterable: true,
          sortable: true,
        },
        {
          id: 'lastName',
          name: LAST_NAME,
          field: 'lastName',
          filterable: true,
          sortable: true,
        },
        {
          id: 'firstName',
          name: FIRST_NAME,
          field: 'firstName',
          filterable: true,
          sortable: true,
        },
        {
          id: 'secondName',
          name: SECOND_NAME,
          field: 'secondName',
          filterable: true,
          sortable: true,
        },
        {
          id: 'organizationName',
          name: ORGANIZATION,
          field: 'organizationName',
          filterable: true,
          sortable: true,
        },
        {
          id: 'phoneNumber',
          name: PHONE_NUMBER,
          field: 'phoneNumber',
          filterable: true,
          sortable: true,
        },
        {
          id: 'email',
          name: EMAIL,
          field: 'email',
          filterable: true,
          sortable: true,
        },
        {
          id: 'statusName',
          name: STATUS,
          field: 'statusName',
          filterable: true,
          sortable: true,
        },

        {
          id: 'action',
          field: 'action',
          width: 30,
          minWidth: 30,
          maxWidth: 40,
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
          formatter: Formatters.editIcon,
          onCellClick: (e: Event, args: OnEventArgs) => {
            const entity = new UserModel();
            entity.id = args.dataContext.id;

            this.createDialog(entity);
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
              this.userService.delete(id).subscribe(() => {
                this.load();
              });
            }
          },
        },
      ]
    })

    this.gridOptions = {
      autoResize: {
        container: '#user-grid-container',
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
      enableCheckboxSelector: false,
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

  createUser() {
    const entity = new UserModel();
    this.createDialog(entity);
  }

  private createDialog(entity: UserModel) {
    let dialogRef = this.dialog.open<UserFormComponent, UserModel, UserModel>(UserFormComponent, {
      data: entity,
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((r) => {
      const resp = r;
      this.load();
    });
  }
}