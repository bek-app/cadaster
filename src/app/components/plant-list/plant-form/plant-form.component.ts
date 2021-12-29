import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DicKatoService } from 'src/app/services/dic-kato.service';
import { PlantService } from 'src/app/services/plant.service';

@Component({
  selector: 'app-plant-form',
  templateUrl: './plant-form.component.html',
  styleUrls: ['./plant-form.component.css'],
})
export class PlantFormComponent implements OnInit {
  isActive = false;
  form: FormGroup;
  submitted?: boolean;

  oblast: any[] = [];
  region: any[] = [];
  subRegion: any[] = [];
  village: any[] = [];

  oblastName!: string;
  regionName!: string;
  subRegionName!: string;
  villageName!: string;

  address!: string;
  @Output() addPlant: EventEmitter<any> = new EventEmitter();
  @Output() updatePlant: EventEmitter<any> = new EventEmitter();

  constructor(
    private plantService: PlantService,
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private dicKatoService: DicKatoService
  ) {
    this.form = this.fb.group({
      namePlant: new FormControl('', Validators.required),
      oblastId: new FormControl('', Validators.required),
      regionId: new FormControl('', Validators.required),
      subRegionId: new FormControl(),
      villageId: new FormControl(),
      address: new FormControl({ disabled: true }),
      inactive: new FormControl(true, Validators.required),
    });
  }

  ngOnInit(): void {
    this.dicKatoService.getDicKato(1).subscribe((oblast) => {
      this.oblast = oblast;
    });
  }

  formValueChanges() {
    // this.form.controls['oblastId'].valueChanges.subscribe((oblastId) => {
    //   console.log(this.oblast);
    // });
    // this.form.controls['regionId'].valueChanges.subscribe((regionId) => {
    //   if (regionId) {
    //     this.regionName = this.region.find((reg) => reg.id === regionId);
    //     if (this.oblastName && this.regionName) {
    //       this.address = `${this.oblastName}, ${this.regionName}`;
    //     }
    //     this.dicKatoService
    //       .getDicKato(regionId)
    //       .subscribe((subRegion) => (this.subRegion = subRegion));
    //   }
    // });
    // this.form.controls['subRegionId'].valueChanges.subscribe((subRegionId) => {
    //   if (subRegionId !== null) {
    //     this.subRegion
    //       .filter((subReg) => subReg.id === subRegionId)
    //       .map((subReg) => (this.subRegionName = subReg.name));
    //     if (this.oblastName && this.regionName && this.subRegionName) {
    //       this.address = `${this.oblastName}, ${this.regionName}, ${this.subRegionName} `;
    //     }
    //     this.dicKatoService.getDicKato(subRegionId).subscribe((village) => {
    //       this.village = village;
    //     });
    //   }
    // });
    // this.form.controls['villageId'].valueChanges.subscribe((villageId) => {
    //   if (villageId !== null) {
    //     this.village
    //       .filter((vill) => vill.id === villageId)
    //       .map((vill) => (this.villageName = vill.name));
    //     if (
    //       this.oblastName &&
    //       this.regionName &&
    //       this.subRegionName &&
    //       this.villageName
    //     ) {
    //       this.address = `${this.oblastName}, ${this.regionName}, ${this.subRegionName}, ${this.villageName}`;
    //     }
    //   }
    // });
  }

  oblastChange(oblastId: number) {
    if (oblastId) {
      this.oblastName = this.oblast.find((obl) => obl.id === oblastId)?.name;
      this.oblastName ? (this.address = this.oblastName) : '';
      this.region = [];
      this.dicKatoService
        .getDicKato(oblastId)
        .subscribe((region) => (this.region = region));
      this.subRegion = [];
      this.village = [];
    }
  }

  regionChange(regionId: number) {
    if (regionId) {
      this.regionName = this.region.find((reg) => reg.id === regionId)?.name;
     
      if (this.oblastName && this.regionName) {
        this.address = `${this.oblastName}, ${this.regionName}`;
      }
      this.dicKatoService
        .getDicKato(regionId)
        .subscribe((subRegion) => (this.subRegion = subRegion));
    }
    this.village = [];
  }

  subRegionChange(subRegionId: number) {
    if (subRegionId) {
      this.subRegion
        .filter((subReg) => subReg.id === subRegionId)
        .map((subReg) => (this.subRegionName = subReg.name));

      if (this.oblastName && this.regionName && this.subRegionName) {
        this.address = `${this.oblastName}, ${this.regionName}, ${this.subRegionName} `;
      }
      this.dicKatoService.getDicKato(subRegionId).subscribe((village) => {
        this.village = village;
      });
    }
  }

  villageChange(villageId: number) {
    if (villageId) {
      this.village
        .filter((vill) => vill.id === villageId)
        .map((vill) => (this.villageName = vill.name));
      if (this.oblastName && this.regionName) {
        this.address = `${this.oblastName}, ${this.regionName}, ${this.subRegionName}, ${this.villageName}`;
      }
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const data = { userId: 1, ...this.form.value };
    !this.isActive ? this.addPlant.emit(data) : this.updatePlant.emit(data);
    this.hidePlantModal();
  }
  hidePlantModal() {
    this.activeModal.close();
    this.submitted = this.isActive = false;
    this.form.reset();
  }

  editForm(id: number) {
    this.isActive = true;
    this.plantService.getPlantById(id).subscribe((data) => {
      this.form.patchValue(data);
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
