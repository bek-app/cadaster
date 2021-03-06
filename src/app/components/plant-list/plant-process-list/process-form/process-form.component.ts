import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DicFormComponent } from 'src/app/components/dic-form/dic-form.component';
import { Dictionary } from 'src/app/models/dictionary.model';
import { DicMaterialService } from 'src/app/services/dic-materials.service';
import { DicProcessService } from 'src/app/services/dic-process.service';
import { PlantProcessService } from 'src/app/services/plant-process.service';

@Component({
  selector: 'app-process-form',
  templateUrl: './process-form.component.html',
  styleUrls: ['./process-form.component.css'],
})
export class ProcessFormComponent implements OnInit {
  form: FormGroup;
  isActive = false;
  submitted = false;
  dicProcessList: Dictionary[] = [];
  dicMaterialsList: Dictionary[] = [];
  subProccessesList: Dictionary[] = [];
  dicDialogRef: any;
  viewMode = false;
  items: Dictionary[] = [];

  dicLabel: string = '';
  dicControlName: string = '';
   @Output() addProcess: EventEmitter<any> = new EventEmitter();
  @Output() updateProcess: EventEmitter<any> = new EventEmitter();

  constructor(
    private dicFormDialog: MatDialog,
    private plantProcessService: PlantProcessService,
    private fb: FormBuilder,
    private dicMaterialService: DicMaterialService,
    private dicProcessService: DicProcessService
  ) {
    this.form = this.fb.group({
      dicProcessId: new FormControl('', Validators.required),
      subProccesses: new FormControl(),
      materials: new FormControl(),
      // oddsLevel: new FormControl('', Validators.required),
      // amountConsumed: new FormControl(),
      // calculatingCalorific: new FormControl(),
      // calculatingConversion: new FormControl(),
      // calculatingCarbon: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.getDicProcess();
    this.getDicMaterial();
  }

  itemChange(item: any) {
    const value = item.value;
    this.items = [];
    if (value == 0) {
      this.dicLabel = `???????????????????????? ???????????????? ?????? ?????????????? 4 ???????????? 8,9`;
      this.dicControlName = 'subProccesses';
      this.items = this.subProccessesList;
    } else if (value === 1) {
      this.dicLabel = `???????????????????????? ?????????????? ?????? ??????????`;
      this.dicControlName = 'materials';
      this.items = this.dicMaterialsList;
    }
  }

  openDicFormDialog(name: string) {
    this.dicDialogRef = this.dicFormDialog.open(DicFormComponent, {
      width: '600px',
    });
    console.log(name);

    if (name === 'materials') {
      this.dicDialogRef.componentInstance.dicTitle = '???????????????? ??????????????????';
      this.dicDialogRef.componentInstance.dicLabel = '????????????????';
      this.dicMaterialAdded();
    } else if (name === 'dicProcess') {
      this.dicDialogRef.componentInstance.dicTitle = '???????????????? ????????????????';
      this.dicDialogRef.componentInstance.dicLabel = '??????????????';
      this.dicProccessAdded();
    } else {
      this.dicDialogRef.componentInstance.dicTitle = '???????????????? ??????????????????????';
      this.dicDialogRef.componentInstance.dicLabel = '????????????????????';
      this.subProccessAdded();
    }
  }

  dicProccessAdded() {
    this.dicDialogRef.componentInstance.dicAdded.subscribe(
      (data: Dictionary) => {
        this.dicProcessService.addDicProcess(data).subscribe((res) => {
          this.getDicProcess();
          this.form.controls['dicProcessId'].setValue(res.id);
          this.dicDialogRef.close();
        });
      }
    );
  }

  dicMaterialAdded() {
    this.dicDialogRef.componentInstance.dicAdded.subscribe(
      (data: Dictionary) => {
        this.dicMaterialService.addDicMaterial(data).subscribe((res) => {
          this.getDicMaterial();

          this.form.controls['materials'].setValue([res.id]);
          this.dicDialogRef.close();
        });
      }
    );
  }

  subProccessAdded() {
    this.dicDialogRef.componentInstance.dicAdded.subscribe(
      (data: Dictionary) => {
        this.dicProcessService.addDicProcess(data).subscribe((res) => {
          this.getDicProcess();
          this.form.controls['subProccesses'].setValue([res.id]);
          this.dicDialogRef.close();
        });
      }
    );
  }

  getDicProcess() {
    this.dicProcessService.getDicProcess().subscribe((res) => {
      this.dicProcessList = res;
      this.subProccessesList = res;
      this.items = res;
    });
  }

  getDicMaterial() {
    this.dicMaterialService.getDicMaterial().subscribe((res) => {
      this.dicMaterialsList = res;
      this.items = res;
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const data = { ...this.form.value };
    console.log(data);

    !this.isActive ? this.addProcess.emit(data) : this.updateProcess.emit(data);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  editForm(id: number) {
    this.isActive = true;
    this.plantProcessService.getPlantProcessById(id).subscribe((data: any) => {
      if (data.isMaterial) {
        this.dicLabel = `???????????????????????? ???????????????? ?????? ?????????????? 4 ???????????? 8,9`;
        this.dicControlName = 'subProccesses';
        this.items = this.subProccessesList;
       } else {
        this.dicLabel = `???????????????????????? ?????????????? ?????? ??????????`;
        this.dicControlName = 'materials';
        this.items = this.dicMaterialsList;
      }

      this.form.patchValue(data);
    });
  }
}
