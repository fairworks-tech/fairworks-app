import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit, OnDestroy {

  public profiling!: FormGroup;
  public expList!: FormArray;

  stepper = {
    currentStep: 1,
    maxStep: 4,
    status: 'clean' //clean, progress, complete
  }

  constructor(
    private fb: FormBuilder
  ) { 

  }

  ngOnInit(): void {
    this.profiling = this.fb.group({
      userInfo: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [
            Validators.required,
            Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
          ]
        ],
        rePassword: ['', [
            Validators.required, 
            Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
          ]
        ]
      }),
      userExp: this.fb.array([this.initExpForm()])
    });

    this.expList = this.profiling.get('userExp') as FormArray;
  }

  // userExp(): FormArray {
  //   return this.profiling.get('userExp') as FormArray
  // }

  initExpForm(): FormGroup {
    return this.fb.group({
      jobTitle: ['', [Validators.required]],
      organisation: ['', [Validators.required]],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      summary: ['', [Validators.required]]
    });
  }

  addExp() {
    this.expList.push(this.initExpForm()); 
  }

  removeExp(index: number) {
    this.expList.removeAt(index);  
  }

  get experienceFormGroup() {
    return this.profiling.get('userExp') as FormArray;
  }

  save() {
    console.log(this.profiling.value);
    this.stepper.currentStep = this.stepper.currentStep + 1;
  }

  submit() {

  }

  ngOnDestroy(): void {
    
  }
  
}
