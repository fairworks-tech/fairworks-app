import { Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

import { UtilService } from "src/app/shared/services/utils.service";

import { FW_COUNTRIES } from "src/app/config/fw.countries";
import { FW_PHONECODES } from "src/app/config/fw.phonecodes";
import { filter } from "rxjs";

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

  public isFormValueInvalid = {
    email: false,
    password: false,
    rePassword: false,
    firstName: false,
    lastName: false,
  };

  public hasFormError = {
    email: "",
    password: "",
    rePassword: "",
    firstName: "",
    lastName: "",
  };

  helperText = {
    password:
      "Min 8 and max 20 characters. At least one lowercase, uppercase, number and any of the following special character !@#$%^&*",
    endDate: "If this is your current job, provide the expected end date.",
    completionDate:
      "If you are currently pursuing, provide the expected completion date.",
  };

  public checkingEmail = false;
  public creatingProfile = false;

  constructor(
    private elRef: ElementRef,
    private fb: FormBuilder,
    public _util: UtilService,
  ) {
    this.countryList = FW_COUNTRIES;
    this.phoneCodeData = FW_PHONECODES;
    this.phoneCodeList = [
      ...new Set(FW_PHONECODES.map((item: any) => item["dial"])),
    ];
  }

  ngOnInit(): void {
    this.setYearRange();

    this.profiling = this.fb.group({
      userLoginInfo: this.fb.group({
        email: ["", [Validators.required, Validators.email]],
        password: [
          "",
          [
            Validators.required,
            Validators.pattern(
              /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}/,
            ),
          ],
        ],
        rePassword: [
          "",
          [
            Validators.required,
            Validators.pattern(
              /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}/,
            ),
          ],
        ],
      }),
      userInfo: this.fb.group({
        firstName: ["", [Validators.required, Validators.minLength(2)]],
        lastName: ["", [Validators.required, Validators.minLength(2)]],
        city: ["", [Validators.required, Validators.minLength(3)]],
        country: ["", [Validators.required]],
        phoneCode: ["", [Validators.required]],
        phone: [
          "",
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/(?=.*\d)/),
          ],
        ],
      }),
      userExpForm: this.fb.array([this.initExpForm()]),
      userEduForm: this.fb.array([this.initEduForm()]),
    });

    this.expList = this.profiling.get("userExpForm") as FormArray;
    this.eduList = this.profiling.get("userEduForm") as FormArray;
    this.userInfoForm = this.profiling.get("userInfo") as FormGroup;

    this.userInfoForm.controls["country"].valueChanges.subscribe(
      (change: any) => {
        this.phoneCodeData.filter((o: any) => {
          if (o["countryName"] === change) {
            this.userInfoForm.controls["phoneCode"].setValue(o.dial);
          }
        });
      },
    );
  }

  initExpForm(): FormGroup {
    return this.fb.group({
      jobTitle: ["", [Validators.required]],
      organisation: ["", [Validators.required]],
      jobType: ["", [Validators.required]],
      location: ["", [Validators.required]],
      locationType: ["", [Validators.required]],
      jobStartMonth: ["", [Validators.required]],
      jobStartYear: ["", [Validators.required]],
      jobEndMonth: ["", [Validators.required]],
      jobEndYear: ["", [Validators.required]],
      jobDesc: ["", [Validators.required]],
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
      institution: ["", [Validators.required]],
      degree: ["", Validators.required],
      specialization: ["", Validators.required],
      eduStartMonth: ["", [Validators.required]],
      eduStartYear: ["", [Validators.required]],
      eduEndMonth: ["", [Validators.required]],
      eduEndYear: ["", [Validators.required]],
      grade: ["", [Validators.required]],
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

  gotoNext() {
    // Step1 - Form validation
    if (
      this.stepper.currentStep === 1 &&
      this.profiling.controls["userLoginInfo"].touched
    ) {
      this.processStep1();
    }

    // Step2 - Form validation
    if (
      this.stepper.currentStep === 2 &&
      this.profiling.controls["userInfo"].touched
    ) {
      this.processStep2();
    }

    // Step3 - Form validation
    if (
      this.stepper.currentStep === 3 &&
      this.profiling.controls["userExpForm"].touched
    ) {
      this.processStep3();
    }

    // Step4 - Form validation
    if (
      this.stepper.currentStep === 4 &&
      this.profiling.controls["userEduForm"].touched
    ) {
      this.processStep4();
    }
  }

  processStep1() {
    this.isFormValueInvalid.email = false;
    this.isFormValueInvalid.password = false;
    this.isFormValueInvalid.rePassword = false;
    if (this.profiling.controls["userLoginInfo"].valid) {
      if (
        this.profiling.value.userLoginInfo.password !==
        this.profiling.value.userLoginInfo.rePassword
      ) {
        this.isFormValueInvalid.rePassword = true;
        this.hasFormError.rePassword = "Passwords don't match";
      } else {
        console.log(this.profiling);
        this.stepper.currentStep = this.stepper.currentStep + 1;
      }
    } else if (
      !this.profiling.value.userLoginInfo.password.match("^(?=.*[A-Z])")
    ) {
      this.isFormValueInvalid.password = true;
      this.hasFormError.password = "At least uppercase letter.";
    } else if (
      !this.profiling.value.userLoginInfo.password.match("(?=.*[a-z])")
    ) {
      this.isFormValueInvalid.password = true;
      this.hasFormError.password = "At least one lowercase letter.";
    } else if (
      !this.profiling.value.userLoginInfo.password.match("(.*[0-9].*)")
    ) {
      this.isFormValueInvalid.password = true;
      this.hasFormError.password = "At least one digit.";
    } else if (
      !this.profiling.value.userLoginInfo.password.match("(?=.*[!@#$%^&*])")
    ) {
      this.isFormValueInvalid.password = true;
      this.hasFormError.password = "At least one special character.";
    } else if (!this.profiling.value.userLoginInfo.password.match(".{8,}")) {
      this.isFormValueInvalid.password = true;
      this.hasFormError.password = "At least 8 characters long.";
    }
  }

  processStep2() {
    if (this.profiling.controls["userInfo"].valid) {
      console.log(this.profiling);
      this.stepper.currentStep = this.stepper.currentStep + 1;
    } else {
      console.log(this.profiling);
      console.error("Invalid form values - step2");
    }
  }

  processStep3() {
    if (this.profiling.controls["userExpForm"].valid) {
      console.log(this.profiling);
      this.stepper.currentStep = this.stepper.currentStep + 1;
    } else {
      console.log(this.profiling);
      console.error("Invalid form values - step3");
    }
  }

  processStep4() {
    if (this.profiling.controls["userEduForm"].valid) {
      console.log(this.profiling);
      this.submit();
    } else {
      console.log(this.profiling);
      console.error("Invalid form values - step4");
    }
  }

  gotoPrev() {
    this.stepper.currentStep = this.stepper.currentStep - 1;
  }

  isEmailExists() {
    if (this._util.isValidEmail(this.profiling.value.userLoginInfo.email)) {
      this.isFormValueInvalid.email = false;
      this.checkingEmail = !this.checkingEmail;
    } else {
      this.isFormValueInvalid.email = true;
      this.hasFormError.email = "Invalid Email";
    }
  }

  submit() {
    console.log(this.profiling.value);
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
