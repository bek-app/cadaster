import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DicKatoService } from '@services/dic-kato.service';
import { DicOkedService } from '@services/dictionary/dic-oked.service';
import { TreeData } from 'mat-tree-select-input';
import { RegistrationRequestModel } from 'src/app/models/administration/registration-request.model';
import { UserService } from 'src/app/services/administration/user/user.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PasswordValidators } from 'src/app/validators/password-validators';

declare const webSocket_init: any;
declare const getKeyInfoAuthCall: any;
declare const findSubjectAttr: any;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
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

  dicOkeds: TreeData[] = [];
  constructor(
    private router: Router,
    private titleService: Title,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private dicKatoService: DicKatoService,
    private dicOkedService: DicOkedService
  ) {
    this.registrationForm = new FormGroup({
      organizationBin: new FormControl('', [Validators.required]),
      organizationName: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),

      certificate: new FormControl({ value: '', disabled: true }, [
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
      isJur:new FormControl(true, Validators.required)
    });

    // lastName: new FormControl({ value: '', disabled: true }, [
    //   Validators.required,
    // ]),
    // firstName: new FormControl({ value: '', disabled: true }, [
    //   Validators.required,
    // ]),
    // iin: new FormControl({value: '', disabled: true}, [Validators.required]),

    /*  password: new FormControl('', [Validators.required
        , Validators.minLength(8)
        , Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}')]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(8)])*/
    /*   this.registrationForm.controls.passwordConfirm.setValidators([Validators.required
      , Validators.minLength(8)
      , this.confirmPasswordValidator]);*/
  }

  private confirmPasswordValidator = (control: AbstractControl) => {
    return PasswordValidators.confirmPasswordByControlValidator(
      control,
      this.registrationForm.controls.password.value
    );
  };

  ngOnInit(): void {
    webSocket_init();
    this.dicKatoService.getDicKato(1).subscribe((oblast) => {
      this.oblast = oblast;
    });

    this.dicOkedService.getDicOked().subscribe((oked) => {
      this.dicOkeds = oked;
    });
  }

  filter(array: TreeData[], text: string) {
    console.log(text);

    const getNodes = (
      result: any[],
      object: { name: string; children: any[] }
    ) => {
      if (object.name.toLowerCase().startsWith(text)) {
        result.push(object);
        return result;
      }
      if (Array.isArray(object.children)) {
        const children = object.children.reduce(getNodes, []);
        if (children.length) result.push({ ...object, children });
      }
      return result;
    };

    this.dicOkeds = array.reduce(getNodes, []);
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

  register() {
    const regRequest = new RegistrationRequestModel();
    // regRequest.organizationBin =
    //   this.registrationForm.controls.organizationBin.value;
    regRequest.organizationName =
      this.registrationForm.controls.organizationName.value;
  //  regRequest.iin = this.registrationForm.controls.iin.value;
  //   regRequest.lastName = this.registrationForm.controls.lastName.value;
  //   regRequest.firstName = this.registrationForm.controls.firstName.value;
  //   regRequest.certificate = this.registrationForm.controls.certificate.value;
  //   regRequest.email = this.registrationForm.controls.email.value;
  //   regRequest.phone = this.registrationForm.controls.phone.value;
  //  regRequest.password = this.registrationForm.controls.password.value;

    const okedId = this.registrationForm.controls.okedId.value;
    const data = {
      ...this.registrationForm.value,
      okedId: okedId.value,
      organizationName: regRequest.organizationName,
    };
    console.log(data);

    this.userService.register(data).subscribe(
      (response) => {
        if (response && response.succeeded) {
          this.notificationService.success(
            'Пользователь успешно зарегестрирован'
          );
          this.router.navigate(['/auth/login']);
        }
      },
      (error) => {
        const err = error;
        this.notificationService.error(error.error);
      }
    );
  }

  chooseEcp() {
    getKeyInfoAuthCall((res: any) => {
      const subjectAttrs = res.subjectDn.split(',');
      const iin = findSubjectAttr(subjectAttrs, 'SERIALNUMBER').substr(3);
      const email = findSubjectAttr(subjectAttrs, 'E');
      let cn = findSubjectAttr(subjectAttrs, 'CN');
      cn = cn || '';
      var middleName = findSubjectAttr(subjectAttrs, 'G');
      middleName = middleName || '';
      let fullname = cn + ' ' + middleName;
      const bin = findSubjectAttr(subjectAttrs, 'OU');
      let organizationName = findSubjectAttr(subjectAttrs, 'O');
      if (organizationName)
        organizationName = organizationName.replace('\\', '').replace('\\', '');
      // let middleName = findSubjectAttr(subjectAttrs, 'G');
      //middleName = middleName || '';
      //const fullName = cn.concat(" ").concat(middleName);

      if (bin) {
        this.registrationForm.controls.organizationBin.setValue(bin.substr(3));
        this.registrationForm.controls.organizationName.setValue(
          organizationName
        );
        this.registrationForm.controls.isJur.setValue(true);
        this.registrationForm.controls.boss.setValue(fullname);
      }
      // this.registrationForm.controls.iin.setValue(iin);
      else {
        this.registrationForm.controls.organizationBin.setValue(iin);
        this.registrationForm.controls.organizationName.setValue(fullname);
        this.registrationForm.controls.boss.setValue(fullname);
        this.registrationForm.controls.responsible.setValue(fullname);
        this.registrationForm.controls.isJur.setValue(false);
        // const fullNameArray = cn.split(' ');
        // this.registrationForm.controls.lastName.setValue(fullNameArray[0]);
        // this.registrationForm.controls.firstName.setValue(fullNameArray[1]);
      }
      const pem = res['pem'];
      this.registrationForm.controls.certificate.setValue(pem);
    });
  }

  toLogin() {
    this.router.navigate(['/auth/login']);
  }
}
