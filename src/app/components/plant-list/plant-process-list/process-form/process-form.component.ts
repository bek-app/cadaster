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
      subProccesses: new FormControl(''),
      materials: new FormControl('', Validators.required),
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

  openDicFormDialog(name: string) {
    this.dicDialogRef = this.dicFormDialog.open(DicFormComponent, {
      width: '600px',
    });

    if (name === 'dicMaterial') {
      this.dicDialogRef.componentInstance.dicTitle = 'Добавить материалы';
      this.dicDialogRef.componentInstance.dicLabel = 'Материал';
      this.dicMaterialAdded();
    } else if (name === 'dicProcess') {
      this.dicDialogRef.componentInstance.dicTitle = 'Добавить процессы';
      this.dicDialogRef.componentInstance.dicLabel = 'Процесс';
      this.dicProccessAdded();
    } else {
      this.dicDialogRef.componentInstance.dicTitle = 'Добавить подпроцессы';
      this.dicDialogRef.componentInstance.dicLabel = 'Подпроцесс';
      this.subProccessAdded();
    }
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
    });
  }

  getDicMaterial() {
    this.dicMaterialService.getDicMaterial().subscribe((res) => {
      this.dicMaterialsList = res;
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const data = { ...this.form.value };
    !this.isActive ? this.addProcess.emit(data) : this.updateProcess.emit(data);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  editForm(id: number) {
    this.isActive = true;
    this.plantProcessService.getPlantProcessById(id).subscribe((data) => {
      this.form.patchValue(data);
    });
  }
}
