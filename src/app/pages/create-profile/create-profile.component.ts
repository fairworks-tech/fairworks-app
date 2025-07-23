import { Component, OnDestroy, OnInit, DestroyRef, inject } from "@angular/core";
import { FormsModule, FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UtilsService } from "src/app/shared/services/utils.service";
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { ComboboxComponent } from "src/app/shared/components/combobox/combobox.component";

import { FW_MONTHS } from "src/app/constants/fw.months";
import { Country, PublicDataService } from "src/app/data-access/public-data.service";
import { CreateProfileService } from "src/app/data-access/create-profile.service";
import { StepStatus } from "src/app/data-access/step-status.enum";

@Component({
  selector: "app-create-profile",
  templateUrl: "./create-profile.component.html",
  styleUrl: "./create-profile.component.scss",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    ComboboxComponent
  ],
  standalone: true
})
export class CreateProfileComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  public profiling!: FormGroup;
  public expList!: FormArray;
  public eduList!: FormArray;
  public countryList: any;
  public phoneCodeData: any;
  public phoneCodeList: any;
  public selectedCountry: any;
  public startYear = new Date().getFullYear();
  public yearRange: any = [];
  public monthRange: any = FW_MONTHS;

  stepper = {
    currentStep: 1,
    maxStep: 4,
    status: StepStatus.CLEAN,
  };

  stepConfig = {
    userLoginInfo: {
      index: 1,
      nextBtnClicked: false,
      state: StepStatus.CLEAN,
    },
    userInfo: {
      index: 2,
      nextBtnClicked: false,
      state: StepStatus.CLEAN,
    },
    userExpForm: {
      index: 3,
      nextBtnClicked: false,
      state: StepStatus.CLEAN,
    },
    userEduForm: {
      index: 4,
      nextBtnClicked: false,
      state: StepStatus.CLEAN,
    },
  };
  userInfoForm: any;

  public isStep1Invalid: any = {};
  public hasStep1Error: any = {};
  public fillStep1Error: boolean = false;
  public isStep2Invalid: any = {};
  public hasStep2Error: any = {};
  public fillStep2Error: boolean = false;
  public isStep3Invalid: any = {};
  public hasStep3Error: any = {};
  public isStep4Invalid: any = {};
  public hasStep4Error: any = {};

  helperText = {
    password:
      "Min 8 and max 20 characters. At least one lowercase, uppercase, number and any of the following special character !@#$%^&*",
    endDate: "If this is not your current job, provide the end date.",
    completionDate: "If you are currently pursuing, provide the expected completion date.",
  };

  public checkingEmail = false;
  public creatingProfile = false;

  constructor(
    private readonly fb: FormBuilder,
    public _util: UtilsService,
    private readonly publicDataService: PublicDataService,
    private readonly createProfileService: CreateProfileService,
  ) {
    this.setYearRange();
  }

  ngOnInit(): void {
    this.resetStepErrors(1);
    this.resetStepErrors(2);
    this.resetStepErrors(3);
    this.resetStepErrors(4);

    this.profiling = this.fb.group({
      userLoginInfo: this.fb.group({
        email: ["", [Validators.required, Validators.email]],
        password: [
          "",
          [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}/)],
        ],
        rePassword: [
          "",
          [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}/)],
        ],
      }),
      userInfo: this.fb.group({
        firstName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        lastName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        city: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        country: ["", [Validators.required, Validators.maxLength(100)]],
        phoneCode: [
          "",
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(4),
            Validators.pattern("^\\+?[0-9]{1,4}$"),
          ],
        ],
        phone: [
          "",
          [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern("^[0-9]+$")],
        ],
      }),
      userExpForm: this.fb.array([this.initExpForm()]),
      userEduForm: this.fb.array([this.initEduForm()]),
    });

    this.expList = this.profiling.get("userExpForm") as FormArray;
    this.eduList = this.profiling.get("userEduForm") as FormArray;
    this.userInfoForm = this.profiling.get("userInfo") as FormGroup;

    // Subscribe to isCurrentJob changes for each experience form
    this.expList.controls.forEach((control, index) => {
      control.get('isCurrentJob')?.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(isCurrent => {
          const endMonthControl = control.get('jobEndMonth');
          const endYearControl = control.get('jobEndYear');
          
          if (isCurrent) {
            endMonthControl?.clearValidators();
            endYearControl?.clearValidators();
          } else {
            endMonthControl?.setValidators([Validators.required]);
            endYearControl?.setValidators([Validators.required, Validators.min(1947), Validators.max(new Date().getFullYear())]);
          }
          
          endMonthControl?.updateValueAndValidity();
          endYearControl?.updateValueAndValidity();
        });
    });

    this.getPublicData();

    // Update country subscription
    this.userInfoForm.controls["country"].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((change: any) => {
        this.countryList.filter((o: any) => {
          if (o["countryName"] === change) {
            this.userInfoForm.controls["phoneCode"].setValue(o.dial);
          }
        });
      });
  }

  getPublicData() {
    this.publicDataService.getCountries().subscribe({
      next: (data: Country[]) => {
        this.countryList = data.map(country => {
          let dial = '';
          if (country.idd) {
            dial = country.idd.root;
            if (country.idd.suffixes?.length === 1) {
              dial += country.idd.suffixes[0];
            }
          }
          return {
            countryCode: country.cca2,
            countryName: country.name.common,
            countryflag: country.flags.png,
            dial: dial,
          };
        });
        this.countryList.sort((a: any, b: any) => a.countryName.localeCompare(b.countryName));
      },
      error: (error: any) => {
        console.error("Error fetching countries:", error);
      }
    });
  }

  initExpForm(): FormGroup {
    return this.fb.group({
      jobTitle: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      organisation: ["", [Validators.required, Validators.minLength(2)]],
      jobType: ["", [Validators.required]],
      location: ["", [Validators.required, Validators.minLength(2)]],
      locationType: ["", [Validators.required]],
      jobStartMonth: ["", [Validators.required]],
      jobStartYear: ["", [Validators.required, Validators.min(1947), Validators.max(new Date().getFullYear())]],
      isCurrentJob: [false],
      jobEndMonth: ["", [Validators.required]],
      jobEndYear: ["", [Validators.required, Validators.min(1947), Validators.max(new Date().getFullYear())]],
      jobDesc: ["", [Validators.maxLength(500)]],
    });
  }

  addExp() {
    this.expList.push(this.initExpForm());
  }

  removeExp(index: number) {
    this.expList.removeAt(index);
  }

  get experienceFormGroup() {
    return this.profiling.get("userExpForm") as FormArray;
  }

  initEduForm(): FormGroup {
    return this.fb.group({
      institution: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      degree: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      specialization: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      eduStartMonth: ["", [Validators.required]],
      eduStartYear: ["", [Validators.required, Validators.min(1947), Validators.max(new Date().getFullYear())]], // Year between 1900 and the current year
      eduEndMonth: ["", [Validators.required]],
      eduEndYear: ["", [Validators.required, Validators.min(1947), Validators.max(new Date().getFullYear())]], // Year between 1900 and the current year
      grade: ["", [Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$")]], // Grade in GPA or percentage format
    });
  }

  addEdu() {
    this.eduList.push(this.initEduForm());
  }

  removeEdu(index: number) {
    this.eduList.removeAt(index);
  }

  get educationFormGroup() {
    return this.profiling.get("userEduForm") as FormArray;
  }

  setYearRange() {
    for (let i = 0; i < 100; i++) {
      this.yearRange.push(this.startYear - i);
    }
  }

  // Helper method to set form error for any step
  setStepError(stepNumber: number, field: string, errorMessage: string) {
    const errorState = {
      isInvalid: `isStep${stepNumber}Invalid`,
      hasError: `hasStep${stepNumber}Error`
    };

    (this as any)[errorState.isInvalid][field] = true;
    (this as any)[errorState.hasError][field] = errorMessage;
  }

  processStep1() {
    this.resetStepErrors(1); // Reset form errors

    const userLoginInfo = this.profiling.value.userLoginInfo;

    // Check if email is valid first
    this.isValidEmail();

    if (!this.profiling.controls["userLoginInfo"].valid) {
      const passwordValidations = [
        { regex: /^(?=.*[A-Z])/, error: "At least one uppercase letter." },
        { regex: /(?=.*[a-z])/, error: "At least one lowercase letter." },
        { regex: /(.*[0-9].*)/, error: "At least one digit." },
        { regex: /(?=.*[!@#$%^&*])/, error: "At least one special character." },
        { regex: /.{8,}/, error: "At least 8 characters long." },
      ];

      for (const validation of passwordValidations) {
        if (!userLoginInfo.password.match(validation.regex)) {
          this.setStepError(1, "password", validation.error);
          return;
        }
      }
    } else if (userLoginInfo.password !== userLoginInfo.rePassword) {
      this.setStepError(1, "rePassword", "Passwords don't match");
    } else {
      this.stepper.currentStep += 1;
    }
  }

  isValidEmail() {
    if (!this._util.isValidEmail(this.profiling.value.userLoginInfo.email)) {
      this.checkingEmail = !this.checkingEmail;
      this.setStepError(1, "email", "Invalid Email");
    } else {
      this.isStep1Invalid["email"] = false;
      this.hasStep1Error["email"] = null;
    }
  }

  processStep2() {
    const userInfo = this.profiling.value.userInfo;

    if (!this.profiling.controls["userInfo"].valid) {
      if (userInfo.firstName === "") {
        this.setStepError(2, "firstName", "Please enter a valid first name.");
      }
      if (userInfo.lastName === "") {
        this.setStepError(2, "lastName", "Please enter a valid last name.");
      }
      if (userInfo.city === "") {
        this.setStepError(2, "city", "Please enter a valid city name.");
      }
    } else {
      this.stepper.currentStep = this.stepper.currentStep + 1;
    }
  }

  processStep3() {
    if (!this.profiling.controls["userExpForm"].valid) {
      
    } else {
      this.stepper.currentStep = this.stepper.currentStep + 1;
    }
  }

  processStep4() {
    if (!this.profiling.controls["userEduForm"].valid) {
      
    } else {
      this.submit();
    }
  }

  reqToPrevStep() {
    this.stepper.currentStep = this.stepper.currentStep - 1;
  }

  reqToNextStep(currentStep: number) {
    const stepConfig = {
      1: {
        control: 'userLoginInfo',
        process: () => this.processStep1(),
        errorFlag: 'fillStep1Error',
        errorMessage: 'Please fill in your login information.'
      },
      2: {
        control: 'userInfo',
        process: () => this.processStep2(),
        errorFlag: 'fillStep2Error',
        errorMessage: 'Please fill in your personal information.'
      },
      3: {
        control: 'userExpForm',
        process: () => this.processStep3(),
        errorMessage: 'Please provide your employment history.'
      },
      4: {
        control: 'userEduForm',
        process: () => this.processStep4(),
        errorMessage: 'Please provide your educational information.'
      }
    };

    const step = stepConfig[currentStep as keyof typeof stepConfig];
    if (!step) return;

    const formControl = this.profiling.controls[step.control];
    
    if (formControl.touched) {
      step.process();
    } else {
      if ('errorFlag' in step) {
        (this as any)[step.errorFlag] = true;
      }
      console.log(step.errorMessage);
    }
  }
  
  // Helper method to reset form errors for any step
  resetStepErrors(stepNumber: number) {
    const errorState = {
      isInvalid: `isStep${stepNumber}Invalid`,
      hasError: `hasStep${stepNumber}Error`
    };

    (this as any)[errorState.isInvalid] = {};
    (this as any)[errorState.hasError] = {};
  }

  submit() {
    this.createProfileService.createProfile(this.profiling.value).subscribe({
      next: (response: any) => {
        console.log('Profile created - ', response);
        this.creatingProfile = false;
      },
      error: (error: any) => {
        console.error('Error creating profile:', error);
        this.creatingProfile = false;
      }
    });
  }

  toggleCurrentJob(event: any) {
    event.preventDefault();
    const checkbox = document.getElementById('isCurrentJob') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change'));
    }
  }

  ngOnDestroy(): void {
    // Reset all form state
    this.profiling.reset();
    
    // Reset all step errors
    this.resetStepErrors(1);
    this.resetStepErrors(2);
    this.resetStepErrors(3);
    this.resetStepErrors(4);
  }

  /**
   * The below code for future purpose and it is half-baked
   * The below code is to show the country phone code along with flags
   */
  selectedCodeItem: any = null;
  showCodeOptions: boolean = false;
  selectCode(item: any) {
    this.selectedCodeItem = item;
    this.showCodeOptions = false;
  }
}
