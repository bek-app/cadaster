import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Dictionary } from '@models/dictionary/dictionary';
import { MtxSelectComponent } from '@ng-matero/extensions/select';
import { DicActivityService } from '@services/dictionary/dic-activity.service';
import { DicFormComponent } from 'src/app/components/dic-form/dic-form.component';
import { ReportActivityChangeService } from 'src/app/services/report-activity-change.service';

@Component({
  selector: 'app-activity-change-form',
  templateUrl: './activity-change-form.component.html',
  styleUrls: ['./activity-change-form.component.css'],
})
export class ActivityChangeFormComponent implements OnInit {
  isActive = false;
  form: FormGroup;
  submitted?: boolean;
  dicRootActivityList: any[] = [];
  viewMode = false;
  dicFormRef: any;
  @Output() onActivityChangeAdded: EventEmitter<any> = new EventEmitter();
  @Output() onActivityChangeUpdated: EventEmitter<any> = new EventEmitter();
  @ViewChild('activitySelect') activitySelect!: MtxSelectComponent;
  constructor(
    private fb: FormBuilder,
    private activityChangeService: ReportActivityChangeService,
    private dicActivity: DicActivityService,
    public dialog: MatDialog
  ) {
    this.form = this.fb.group({
      rootActivityId: new FormControl('', Validators.required),
      changeData: new FormControl('', Validators.required),
      note: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.getDicActivity();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const data = { ...this.form.value };
    !this.isActive
      ? this.onActivityChangeAdded.emit(data)
      : this.onActivityChangeUpdated.emit(data);
  }

  getDicActivity() {
    this.dicActivity
      .getDicActivity()
      .subscribe((res) => (this.dicRootActivityList = res));
  }

  openDicDialog(name: string) {
    this.activitySelect.close();
    this.dicFormRef = this.dialog.open(DicFormComponent, {
      width: '600px',
    });
    if (name === 'dicActivity') {
      this.dicFormRef.componentInstance.dicTitle = 'Добавить вид деятельности';
      this.dicFormRef.componentInstance.dicLabel = 'Вид деятельности';
      this.addDicActivity();
    }
  }
  
  addDicActivity() {
    this.dicFormRef.componentInstance.dicAdded.subscribe((data: Dictionary) => {
      this.dicActivity.addDicActivity(data).subscribe((result) => {
        console.log(result);

        this.getDicActivity();
        // this.form.controls['rootActivityId'].setValue(result.id)
        this.dicFormRef.close();
      });
    });
  }

  editForm(id: number) {
    this.isActive = true;
    this.activityChangeService
      .getReportActivityChangeById(id)
      .subscribe((data: any) => this.form.patchValue(data));
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
