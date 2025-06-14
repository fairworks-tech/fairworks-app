import { Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

import { UtilService } from "src/app/shared/services/utils.service";

import { FW_COUNTRIES } from "src/app/config/fw.countries";
import { FW_PHONECODES } from "src/app/config/fw.phonecodes";
import { CreateProfileService } from "src/app/dataaccess/create-profile.service";

@Component({
  selector: "app-create-profile",
  templateUrl: "./create-profile.component.html",
  styleUrl: "./create-profile.component.scss",
})
export class CreateProfileComponent implements OnInit, OnDestroy {
  public profiling!: FormGroup;
  public expList!: FormArray;
  public eduList!: FormArray;
  public countryList: any;
  public phoneCodeData: any;
  public phoneCodeList: any;
  public selectedCountry: any;
  public startYear = new Date().getFullYear();
  public yearRange: any = [];
  public monthRange: any = [
    { id: "01", name: "January" },
    { id: "02", name: "February" },
    { id: "03", name: "March" },
    { id: "04", name: "April" },
    { id: "05", name: "May" },
    { id: "06", name: "June" },
    { id: "07", name: "July" },
    { id: "08", name: "August" },
    { id: "09", name: "September" },
    { id: "10", name: "October" },
    { id: "11", name: "November" },
    { id: "12", name: "December" },
  ];

  stepper = {
    currentStep: 1,
    maxStep: 4,
    status: "clean", //clean, progress, complete
  };

  stepConfig = {
    userLoginInfo: {
      index: 1,
      nextBtnClicked: false,
      state: "clean", //clean, complete
    },
    userInfo: {
      index: 2,
      nextBtnClicked: false,
      state: "clean", //clean, complete
    },
    userExpForm: {
      index: 3,
      nextBtnClicked: false,
      state: "clean", //clean, complete
    },
    userEduForm: {
      index: 4,
      nextBtnClicked: false,
      state: "clean", //clean, complete
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
    private elRef: ElementRef,
    private fb: FormBuilder,
    public _util: UtilService,
    private createProfileService: CreateProfileService,
  ) {
    this.countryList = FW_COUNTRIES;
    this.phoneCodeData = FW_PHONECODES;
    this.phoneCodeList = [...new Set(FW_PHONECODES.map((item: any) => item["dial"]))];
    this.setYearRange();
  }

  ngOnInit(): void {
    this.resetStep1Errors();
    this.resetStep2Errors();
    this.resetStep3Errors();
    this.resetStep4Errors();

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
      control.get('isCurrentJob')?.valueChanges.subscribe(isCurrent => {
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

    this.userInfoForm.controls["country"].valueChanges.subscribe((change: any) => {
      this.phoneCodeData.filter((o: any) => {
        if (o["countryName"] === change) {
          this.userInfoForm.controls["phoneCode"].setValue(o.dial);
        }
      });
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

  processStep1() {
    this.resetStep1Errors(); // Reset form errors

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
          this.setStep1Error("password", validation.error);
          return;
        }
      }
    } else if (userLoginInfo.password !== userLoginInfo.rePassword) {
      this.setStep1Error("rePassword", "Passwords don't match");
    } else {
      console.log("Info from Step 1 - ", this.profiling);
      this.stepper.currentStep += 1;
    }
  }

  isValidEmail() {
    if (!this._util.isValidEmail(this.profiling.value.userLoginInfo.email)) {
      this.checkingEmail = !this.checkingEmail;
      this.setStep1Error("email", "Invalid Email");
    } else {
      this.isStep1Invalid["email"] = false;
      this.hasStep1Error["email"] = null;
    }
  }

  // Helper method to reset form errors
  resetStep1Errors() {
    this.isStep1Invalid = {};
    this.hasStep1Error = {};
  }

  // Helper method to set form error
  setStep1Error(field: string, errorMessage: string) {
    this.isStep1Invalid[field] = true;
    this.hasStep1Error[field] = errorMessage;
  }

  processStep2() {
    const userInfo = this.profiling.value.userInfo;

    if (!this.profiling.controls["userInfo"].valid) {
      if (userInfo.firstName === "") {
        this.setStep2Error("firstName", "Please enter a valid first name.");
      }
      if (userInfo.lastName === "") {
        this.setStep2Error("lastName", "Please enter a valid last name.");
      }
      if (userInfo.city === "") {
        this.setStep2Error("city", "Please enter a valid city name.");
      }
      console.log(this.profiling);
      console.error("Invalid form values - step2");
    } else {
      console.log(this.profiling);
      this.stepper.currentStep = this.stepper.currentStep + 1;
    }
  }

  resetStep2Errors() {
    this.isStep2Invalid = {};
    this.hasStep2Error = {};
  }

  setStep2Error(field: string, errorMessage: string) {
    this.isStep2Invalid[field] = true;
    this.hasStep2Error[field] = errorMessage;
  }

  processStep3() {
    if (!this.profiling.controls["userExpForm"].valid) {
      console.log(this.profiling);
      console.error("Invalid form values - step3");
    } else {
      console.log(this.profiling);
      this.stepper.currentStep = this.stepper.currentStep + 1;
    }
  }

  resetStep3Errors() {
    this.isStep3Invalid = {};
    this.hasStep3Error = {};
  }

  setStep3Error(field: string, errorMessage: string) {
    this.isStep3Invalid[field] = true;
    this.hasStep3Error[field] = errorMessage;
  }

  processStep4() {
    if (!this.profiling.controls["userEduForm"].valid) {
      console.log(this.profiling);
      console.error("Invalid form values - step4");
    } else {
      console.log(this.profiling);
      this.submit();
    }
  }

  resetStep4Errors() {
    this.isStep4Invalid = {};
    this.hasStep4Error = {};
  }

  setStep4Error(field: string, errorMessage: string) {
    this.isStep4Invalid[field] = true;
    this.hasStep4Error[field] = errorMessage;
  }

  reqToPrevStep() {
    this.stepper.currentStep = this.stepper.currentStep - 1;
  }

  reqToNextStep(currentStep: number) {
    if (currentStep === 1) {
      if (this.profiling.controls["userLoginInfo"].touched) {
        this.processStep1();
      } else if (this.profiling.controls["userLoginInfo"].untouched) {
        this.fillStep1Error = true;
      }
    }
    if (currentStep === 2) {
      if (this.profiling.controls["userInfo"].touched) {
        this.processStep2();
      } else if (this.profiling.controls["userInfo"].untouched) {
        this.fillStep2Error = true;
      }
    }
    if (currentStep === 3) {
      if (this.profiling.controls["userExpForm"].touched) {
        this.processStep3();
      } else if (this.profiling.controls["userExpForm"].untouched) {
        console.log("Please provide your employment history.");
      }
    }
    if (currentStep === 4) {
      if (this.profiling.controls["userEduForm"].touched) {
        this.processStep4();
      } else if (this.profiling.controls["userEduForm"].untouched) {
        console.log("Please provide your educational information.");
      }
    }
  }

  submit() {
    console.log('Form values - ', this.profiling.value);
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

  ngOnDestroy(): void {}

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
