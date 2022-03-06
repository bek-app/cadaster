import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
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
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  
  registrationForm: FormGroup;
  loading: boolean = false;

  constructor(private router: Router,
    private titleService: Title,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private userService: UserService) { 

    this.registrationForm = new FormGroup({
      organizationBin: new FormControl('', [Validators.required]),
      organizationName: new FormControl({value: '', disabled: true}, [Validators.required]),
      iin: new FormControl({value: '', disabled: true}, [Validators.required]),
      lastName: new FormControl({value: '', disabled: true}, [Validators.required]),
      firstName: new FormControl({value: '', disabled: true}, [Validators.required]),
      certificate: new FormControl({value: '', disabled: true}, [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      
      password: new FormControl('', [Validators.required
        , Validators.minLength(8)
        , Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}')]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(8)])
    });

    this.registrationForm.controls.passwordConfirm.setValidators([Validators.required
      , Validators.minLength(8)
      , this.confirmPasswordValidator]);
  }

  private confirmPasswordValidator = (control: AbstractControl) => {
    return PasswordValidators.confirmPasswordByControlValidator(control, this.registrationForm.controls.password.value);
  };

  ngOnInit(): void {
    webSocket_init();
  }

  register() {
    const regRequest = new RegistrationRequestModel();
    regRequest.organizationBin = this.registrationForm.controls.organizationBin.value;
    regRequest.organizationName = this.registrationForm.controls.organizationName.value;
    regRequest.iin = this.registrationForm.controls.iin.value;
    regRequest.lastName = this.registrationForm.controls.lastName.value;
    regRequest.firstName = this.registrationForm.controls.firstName.value;
    regRequest.certificate = this.registrationForm.controls.certificate.value;
    regRequest.email = this.registrationForm.controls.email.value;
    regRequest.phone = this.registrationForm.controls.phone.value;
    regRequest.password = this.registrationForm.controls.password.value;
    this.userService.register(regRequest).subscribe(response => {
      if (response && response.succeeded) {
        this.notificationService.success('Пользователь успешно зарегестрирован');
        this.router.navigate(['/auth/login']);
      }
    }, (error) => {
      const err = error;
      this.notificationService.error(error.error)
    });
  }

  chooseEcp() {
    getKeyInfoAuthCall((res: any) => {
      const subjectAttrs = res.subjectDn.split(',');
      const iin = findSubjectAttr(subjectAttrs, 'SERIALNUMBER').substr(3);
      const email = findSubjectAttr(subjectAttrs, 'E');
      let cn = findSubjectAttr(subjectAttrs, 'CN');
      cn = cn || '';
      const bin = findSubjectAttr(subjectAttrs, 'OU');
      let organizationName = findSubjectAttr(subjectAttrs, 'O');
      if (organizationName) organizationName = organizationName.replace('\\','').replace('\\','');
      // let middleName = findSubjectAttr(subjectAttrs, 'G');
      //middleName = middleName || '';
      //const fullName = cn.concat(" ").concat(middleName);

      if (bin)
        this.registrationForm.controls.organizationBin.setValue(bin.substr(3));
      this.registrationForm.controls.organizationName.setValue(organizationName);
      this.registrationForm.controls.iin.setValue(iin);
      if (cn) {
        const fullNameArray = cn.split(' ');
        this.registrationForm.controls.lastName.setValue(fullNameArray[0]);
        this.registrationForm.controls.firstName.setValue(fullNameArray[1]);
      }
      const pem = res['pem'];
      this.registrationForm.controls.certificate.setValue(pem);
    });
  }

  toLogin() {
    this.router.navigate(['/auth/login']);
  }
}
