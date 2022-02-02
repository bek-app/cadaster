import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import { Dictionary } from 'src/app/models/dictionary.model';
import { DicUnitService } from 'src/app/services/dic-unit.service';
import { ReportCommentEditorComponent } from '../../cadaster-report-list/report-comment-editor/report-comment-editor.component';
import { DicFormComponent } from '../../dic-form/dic-form.component';

@Component({
  selector: 'app-custom-select-editor',
  templateUrl: './custom-select-editor.component.html',
  styleUrls: ['./custom-select-editor.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomSelectEditorComponent implements OnInit {
  selectedId: any;
  selectedItem: any;
  collection!: any[]; // this will be filled by the collection of your column definition
  onItemChanged = new Subject<any>(); // object
  ref: any;
  dicUnit!: string;
  clearStatus: boolean = false;
  dialogRef: any;
  faCommentDots = faCommentDots;
  constructor(
    private modalService: NgbModal,
    private dicUnitService: DicUnitService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    if (this.selectedId) {
      this.clearStatus = !this.clearStatus;
    }
  }
  onChange(item: any) {
    if (item !== undefined) {
      this.selectedItem = item;
      this.onItemChanged.next(item);
    }
  }
  openCommentDialog() {
    this.dialogRef = this.dialog.open(ReportCommentEditorComponent, {
      minWidth: '400px',
      width: '500px',
    });

    this.dialogRef.componentInstance.saveComment.subscribe((result: any) => {
      console.log(result);
    });
  }
  clearValue() {
    this.onChange({ id: null, name: '' });
  }
  openModal(name: string) {
    this.ref = this.modalService.open(DicFormComponent, {
      size: 'md',
    });
    if (name === 'dicUnit') {
      this.ref.componentInstance.dicTitle = 'Добавить eдиница измерения';
      this.ref.componentInstance.dicLabel = 'Единица измерения ';
      this.dicUnitAdded();
    }
  }
  dicUnitAdded() {
    this.ref.componentInstance.dicAdded.subscribe((data: Dictionary) => {
      this.dicUnitService.addDicUnit(data).subscribe((res) => {
        this.collection.push(res);
        this.onChange(res);
      });
    });
  }
  focus() {}
}
