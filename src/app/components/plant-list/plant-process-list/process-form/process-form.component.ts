import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  ref: any;
  @Output() addProcess: EventEmitter<any> = new EventEmitter();
  @Output() updateProcess: EventEmitter<any> = new EventEmitter();
  constructor(
    private modalService: NgbModal,
    private plantProcessService: PlantProcessService,
    private fb: FormBuilder,
    private dicMaterialService: DicMaterialService,
    private dicProcessService: DicProcessService
  ) {
    this.form = this.fb.group({
      dicProcessId: new FormControl('', Validators.required),
      materials: new FormControl('', Validators.required),
      oddsLevel: new FormControl('', Validators.required),
      amountConsumed: new FormControl(),
      calculatingCalorific: new FormControl(),
      calculatingConversion: new FormControl(),
      calculatingCarbon: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.getDicProcess();
    this.getDicMaterial();
  }
  public myError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }
  openPlantProcessModal(name: string) {
    this.ref = this.modalService.open(DicFormComponent, {
      size: 'md',
    });
    if (name === 'dicMaterial') {
      this.ref.componentInstance.dicTitle = 'Добавить материалы';
      this.ref.componentInstance.dicLabel = 'Материал';
      this.dicMaterialAdded();
    } else if (name === 'dicProcess') {
      this.ref.componentInstance.dicTitle = 'Добавить Процессы';
      this.ref.componentInstance.dicLabel = 'Процесс';
      this.dicProccessAdded();
    }
  }

  dicMaterialAdded() {
    this.ref.componentInstance.dicAdded.subscribe((data: Dictionary) => {
      this.dicMaterialService.addDicMaterial(data).subscribe((res) => {
        this.getDicMaterial();
        this.form.controls['materials'].setValue([res.id]);
      });
    });
  }
  dicProccessAdded() {
    this.ref.componentInstance.dicAdded.subscribe((data: Dictionary) => {
      this.dicProcessService.addDicProcess(data).subscribe((res) => {
        this.getDicProcess();
        this.form.controls['dicProcessId'].setValue(res.id);
      });
    });
  }

  getDicProcess() {
    this.dicProcessService.getDicProcess().subscribe((res) => {
      this.dicProcessList = res;
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
    this.hidePlantProcessModal();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  hidePlantProcessModal() {
     this.form.reset();
    this.isActive = false;
    this.submitted = false;
  }
  editForm(id: number) {
    this.isActive = true;
    this.plantProcessService.getPlantProcessById(id).subscribe((data) => {
      this.form.patchValue(data);
    });
  }
}
