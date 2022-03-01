import { ValidatorFn, AbstractControl, FormGroup } from "@angular/forms";

export class PasswordValidators {
    public static confirmPasswordValidator(confirmPassword: String): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            let password: string = control.value;
            let isInValid = (password !== confirmPassword) ? true : false;
            return isInValid ? { 'confirmPassword': { value: 'Invalid' } } : null;
        };
    };

    public static confirmPasswordByControlValidator(control: AbstractControl, confirmPassword: String): any {
        let password: string = control.value;
        let isInValid = (password !== confirmPassword) ? true : false;
        return isInValid ? { 'confirmPassword': { value: 'Invalid' } } : null;
    };
}
