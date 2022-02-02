import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faComment, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { ReportCommentEditorComponent } from '../../cadaster-report-list/report-comment-editor/report-comment-editor.component';

@Component({
  selector: 'app-custom-input-editor',
  templateUrl: './custom-input-editor.component.html',
  styleUrls: ['./custom-input-editor.component.css'],
})
export class CustomInputEditorComponent implements OnInit {
  selectedId: any;
  selectedItem: any;
  collection!: any[]; // this will be filled by the collection of your column definition
  onItemChanged = new Subject<any>();
  comment: any;
  dialogRef: any;
  faCommentDots = faCommentDots;
  faCheckCircle = faCheckCircle;
  submitted = false;
  form: FormGroup;
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.form.controls.name.setValue(this.selectedItem);
  }

  onChange(event: any) {
    let value = event.target.value;
    this.selectedItem = value;
    this.onItemChanged.next(value);
  }
  openCommentDialog() {
    this.dialogRef = this.dialog.open(ReportCommentEditorComponent, {
      autoFocus: true,
      minWidth: '400px',
      width: '500px',
      // backdropClass: 'dialog-bg-trans',
      // panelClass: 'my-dialog',
    });

    this.dialogRef.componentInstance.saveComment.subscribe((result: any) => {
      !result.isError
        ? this.notificationService.success('Successfully', 'Done')
        : this.notificationService.error('Error', 'Done');
    });
  }

  focus() {}
}
