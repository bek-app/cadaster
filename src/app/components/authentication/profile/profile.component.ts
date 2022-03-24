import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DeclarantProfileService } from '@services/declarant-profile.service';
import { DicKatoService } from '@services/dic-kato.service';
import { DicOkedService } from '@services/dictionary/dic-oked.service';
import { TreeData } from 'mat-tree-select-input';
import { RegistrationRequestModel } from 'src/app/models/administration/registration-request.model';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  registrationForm: FormGroup;
  loading: boolean = false;
  oblast: any[] = [];
  region: any[] = [];
  subRegion: any[] = [];
  village: any[] = [];
  oblastName!: string;
  regionName!: string;
  subRegionName!: string;
  villageName!: string;
  address: string = '';
  dicOkeds: any[] = [];
  isActive = false;
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private dicKatoService: DicKatoService,
    private dicOkedService: DicOkedService,
    private declarantProfileService: DeclarantProfileService
  ) {
    this.registrationForm = new FormGroup({
      organizationBin: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      organizationName: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      oblastId: new FormControl('', Validators.required),
      regionId: new FormControl('', Validators.required),
      okedId: new FormControl('', Validators.required),
      boss: new FormControl('', Validators.required),
      responsible: new FormControl('', Validators.required),
      postIndex: new FormControl(),
      subRegionId: new FormControl(),
      villageId: new FormControl(),
      address: new FormControl(),
      isJur: new FormControl(true, Validators.required),
    });
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.registrationForm.disable();
    this.dicKatoService.getDicKato(1).subscribe((oblast) => {
      this.oblast = oblast;
    });

    this.dicOkedService.getDicOked().subscribe((okeds) => {
      this.dicOkeds = okeds;
    });

    this.declarantProfileService
      .getDeclarantProfile()
      .subscribe((result: any) => {
        const oked = this.findNode(result.okedId, this.dicOkeds);
        this.registrationForm.patchValue(result);
        this.registrationForm.controls['okedId'].setValue(oked);
      });
  }

  findNode(value: number, nodes: any[]): any {
    let foundNodes = nodes.filter((e) => e.value === value);
    if (foundNodes[0]) {
      return foundNodes[0];
    } else {
      for (let i = 0; i < nodes.length; i++) {
        const foundNode = this.findNode(value, nodes[i].children);
        if (foundNode) return foundNode;
      }
    }
  }

  oblastChange(oblastId: number) {
    if (oblastId) {
      this.oblastName = this.oblast.find(
        (obl) => obl.id === this.registrationForm.value.oblastId
      )?.name;

      if (this.oblastName) {
        this.registrationForm.controls.address.setValue(this.oblastName);
        this.registrationForm.controls.regionId.setValue(null);
        this.subRegion = [];
        this.village = [];
      }
      this.dicKatoService.getDicKato(oblastId).subscribe((region) => {
        this.region = region;
      });
    }
  }

  regionChange(regionId: number) {
    if (regionId) {
      this.oblastName = this.oblast.find(
        (obl) => obl.id === this.registrationForm.value.oblastId
      )?.name;

      this.regionName = this.region.find((reg) => reg.id === regionId)?.name;

      if (this.oblastName && this.regionName) {
        this.address = `${this.oblastName}, ${this.regionName}`;
        this.registrationForm.controls.address.setValue(this.address);
        this.registrationForm.value.villageId = null;
        this.registrationForm.value.subRegionId = null;
        this.village = [];
      }

      this.dicKatoService.getDicKato(regionId).subscribe((subRegion) => {
        this.subRegion = subRegion;
      });
    }
  }

  subRegionChange(subRegionId: number) {
    if (subRegionId) {
      this.subRegionName = this.subRegion.find(
        (subReg) => subReg.id === subRegionId
      )?.name;

      if (!this.oblastName)
        this.oblastName = this.oblast.find(
          (obl) => obl.id === this.registrationForm.value.oblastId
        )?.name;

      if (!this.regionName)
        this.regionName = this.region.find(
          (reg) => reg.id === this.registrationForm.value.regionId
        )?.name;

      if (this.oblastName && this.regionName && this.subRegionName) {
        this.address = `${this.oblastName}, ${this.regionName}, ${this.subRegionName} `;
        this.registrationForm.controls.address.setValue(this.address);
      }
      this.dicKatoService.getDicKato(subRegionId).subscribe((village) => {
        this.village = village;
      });
    }
  }

  villageChange(villageId: number) {
    if (villageId) {
      this.villageName = this.village.find(
        (vill) => vill.id === villageId
      )?.name;

      if (!this.oblastName)
        this.oblastName = this.oblast.find(
          (obl) => obl.id === this.registrationForm.value.oblastId
        )?.name;

      if (!this.regionName)
        this.regionName = this.region.find(
          (reg) => reg.id === this.registrationForm.value.regionId
        )?.name;

      if (!this.subRegionName)
        this.subRegionName = this.subRegion.find(
          (subReg) => subReg.id === this.registrationForm.value.subRegionId
        )?.name;

      if (
        this.oblastName &&
        this.regionName &&
        this.subRegionName &&
        this.villageName
      ) {
        this.address = `${this.oblastName}, ${this.regionName}, ${this.subRegionName}, ${this.villageName}`;
        this.registrationForm.controls.address.setValue(this.address);
      }
    }
  }

  onSubmit() {
    const regRequest = new RegistrationRequestModel();

    regRequest.organizationName =
      this.registrationForm.controls.organizationName.value;

    const okedId = this.registrationForm.controls.okedId.value;

    const data = {
      ...this.registrationForm.value,
      okedId: okedId.value,
      organizationName: regRequest.organizationName,
    };

    this.declarantProfileService.registerDeclarantProfile(data).subscribe(
      (response) => {
        this.notificationService.success('Профиль успешно изменён');
        this.registrationForm.disable();
        this.isActive = false;
      },
      (error) => {
        this.notificationService.error(error);
      }
    );
  }

  editProfile() {
    this.isActive = true;
    this.registrationForm.enable();
    this.registrationForm.controls['organizationBin'].disable();
    this.registrationForm.controls['organizationName'].disable();
  }
  filter(array: any[], text: any) {
    const getNodes = (result: any[], object: { text: any; nodes: any[] }) => {
      if (object.text === text) {
        result.push(object);
        return result;
      }
      if (Array.isArray(object.nodes)) {
        const nodes = object.nodes.reduce(getNodes, []);
        console.log(nodes);

        if (nodes.length) result.push({ ...object, nodes });
      }
      return result;
    };

    return array.reduce(getNodes, []);
  }
}
