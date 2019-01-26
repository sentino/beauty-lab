import { AbstractControl, ValidatorFn } from "@angular/forms";

export function validatorFnControlsMatch(firstControlName: string, secondControlName: string): ValidatorFn {

    return (AC: AbstractControl): any | void => {
        const firstControl = AC.get(firstControlName);
        const secondControl = AC.get(secondControlName);

        if (!firstControl || !secondControl) {
            return null;
        }

        if (firstControl.value === secondControl.value) {
            return null;
        }

        secondControl.setErrors({ ...secondControl.errors, match: true });
    };
}