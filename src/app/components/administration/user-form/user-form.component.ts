import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleModel } from '@models/administration/role.model';
import { UserModel } from '@models/administration/user.model';
import { DictionaryModel } from '@models/general/dic.model';
import { RoleService } from '@services/administration/role/role.service';
import { UserService } from '@services/administration/user/user.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
    
  userForm: FormGroup;  
  hideCurrentPassword: boolean = true;
  hideNewPassword: boolean = true;
  //currentPassword!: string;
  // newPassword!: string;
  disableSubmit: boolean = false;

  dicStatuses: Array<DictionaryModel> = [];
  roles: Array<RoleModel> = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: UserModel
    , private userService: UserService
    , private roleService: RoleService
    , private dialogRef: MatDialogRef<UserFormComponent>
    , private notificationService: NotificationService ) {

    this.userForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      organizationName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      secondName: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', Validators.required),
      
      roleIds: new FormControl([], Validators.required),
      statusId: new FormControl('', Validators.required),

      currentPassword: new FormControl(''),

      password: new FormControl(''),
      newPasswordConfirm: new FormControl('')
    });

    this.userService.getStatuses().subscribe((r) => {
      this.dicStatuses = r.data;
      
      const newStatus = this.dicStatuses.find(s => s.code === 'new');
      if (newStatus && !this.data.id)
        this.userForm.controls.statusId.setValue(newStatus.id);
    });

    this.roleService.getList().subscribe((r) => {
      this.roles = r.data;
    });
  }

  ngOnInit(): void {
    if(this.data.id) {
      this.userService.get(this.data.id).subscribe((r) => {
        const resp = r;
        this.userForm.patchValue(r);
      });
    } else {
      if (this.dicStatuses && this.dicStatuses.length > 0) {
        const newStatus = this.dicStatuses.find(s => s.code === 'new');
        if (newStatus && !this.data.id)
          this.userForm.controls.statusId.setValue(newStatus.id);
      }
    }
  }

  save() { 
    if (this.userForm.valid) {
      const entity = {...this.data,...this.userForm.value};

      if (entity.id) {
        this.userService.update(entity).subscribe({
          next: (r) => {
            this.dialogRef.close();
          },
          error: (error) => {
            this.notificationService.error(error.error);
          }
        });

      } else {
        this.userService.create(entity).subscribe({
          next: (r) => {
            this.dialogRef.close();
          }, 
          error: (error) => {
            this.notificationService.error(error.error);
          }
        });
      }
    }
  }

  close() { 
    this.dialogRef.close();
  }
}