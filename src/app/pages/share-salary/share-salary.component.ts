import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { FW_COMPANIES } from "src/app/config/fw.companies";

@Component({
  selector: "app-share-salary",
  templateUrl: "./share-salary.component.html",
  styleUrl: "./share-salary.component.scss",
})
export class ShareSalaryComponent implements OnInit, OnDestroy {
  public salaryDetailing: FormGroup;
  public company: any;
  public jobTitle: any;
  public totalExp: any;
  public gender: any;
  public employmentType: any;
  public officeLocation: any;
  public jobRole: any;
  public fixedSalary: any;
  public variableSalary: any;
  public hasStocks: any;
  public salaryYear: any;
  public offerType: any;

  public companySuggestions: any;
  public yearsOfExp: any;
  public salaryValLakhs: any;
  public salaryValThousands: any;
  public salaryYears: any;
  public showStockFields = false;

  public isFormValueInvalid: any = {
    company: false,
    jobTitle: false,
    totalExp: false,
    gender: false,
    employmentType: false,
    officeLocation: false,
    jobRole: false,
    fixedSalaryLakhs: false,
    fixedSalaryThousands: false,
    variableSalaryLakhs: false,
    variableSalaryThousands: false,
    salaryYear: false,
    offerType: false,
  };

  constructor(private fb: FormBuilder) {
    this.companySuggestions = FW_COMPANIES;
  }

  ngOnInit(): void {
    this.yearsOfExp = this.structYearsOfExp();
    this.salaryValLakhs = this.structSalLakhs();
    this.salaryValThousands = this.structSalThousands();
    this.salaryYears = this.structSalaryYears();

    this.salaryDetailing = this.fb.group({
      company: ["", [Validators.required]],
      jobTitle: ["", [Validators.required]],
      totalExp: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      employmentType: ["", [Validators.required]],
      officeLocation: ["", [Validators.required]],
      jobRole: ["", [Validators.required]],
      fixedSalaryLakhs: ["", [Validators.required]],
      fixedSalaryThousands: ["", [Validators.required]],
      variableSalaryLakhs: ["", [Validators.required]],
      variableSalaryThousands: ["", [Validators.required]],
      hasStocks: ["", [Validators.required]],
      stockValLakhs: [""],
      stockValThousands: [""],
      stockVestingPeriod: [""],
      salaryYear: ["", [Validators.required]],
      offerType: ["", [Validators.required]],
    });

    this.salaryDetailing.controls["hasStocks"].valueChanges.subscribe((x) => {
      if (x === "no" || x === "not-aware") {
        this.showStockFields = false;
        this.salaryDetailing.get("stockValLakhs")?.clearValidators();
        this.salaryDetailing.get("stockValLakhs")?.updateValueAndValidity();
        this.salaryDetailing.get("stockValThousands")?.clearValidators();
        this.salaryDetailing.get("stockValThousands")?.updateValueAndValidity();
        this.salaryDetailing.get("stockVestingPeriod")?.clearValidators();
        this.salaryDetailing.get("stockVestingPeriod")?.updateValueAndValidity();
      } else {
        this.showStockFields = true;
        this.salaryDetailing.get("stockValLakhs")?.setValidators([Validators.required]);
        this.salaryDetailing.get("stockValLakhs")?.updateValueAndValidity();
        this.salaryDetailing.get("stockValThousands")?.setValidators([Validators.required]);
        this.salaryDetailing.get("stockValThousands")?.updateValueAndValidity();
        this.salaryDetailing.get("stockVestingPeriod")?.setValidators([Validators.required]);
        this.salaryDetailing.get("stockVestingPeriod")?.updateValueAndValidity();
      }
    });
  }

  /**
   * Generate the dropdown options for - Total work experience
   */
  structYearsOfExp() {
    const yearsStruct = [{ val: 0, text: "Fresher" }];
    for (let i = 1; i <= 30; i++) {
      yearsStruct.push({
        val: i,
        text: `${i} year${i > 1 ? "s" : ""}`,
      });
    }
    return yearsStruct;
  }

  /**
   * Generate the dropdown options for - Fixed Salary & Variable Salary : Lakhs field
   */
  structSalLakhs() {
    const amountStruct = [];
    for (let i = 0; i < 100; i++) {
      amountStruct.push({
        val: i * 100000,
        text: `${i} Lakh${i === 1 ? "" : "s"}`,
      });
    }
    for (let i = 1; i <= 5; i += 0.1) {
      const roundedValue = parseFloat(i.toFixed(1));
      amountStruct.push({
        val: roundedValue * 10000000,
        text: `${roundedValue} Cr`,
      });
    }
    return amountStruct;
  }

  /**
   * Generate the dropdown options for - Fixed Salary & Variable Salary : Thousands field
   */
  structSalThousands() {
    return Array.from({ length: 19 }, (_, i) => {
      const val = (i + 1) * 5000;
      return { val, text: `${(i + 1) * 5} Thousands` };
    });
  }

  /**
   * Generate the dropdown options for - Salary year & Year of Increment
   */
  structSalaryYears() {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i);
  }

  validateFormData() {
    const controlsToValidate = [
      "company",
      "jobTitle",
      "totalExp",
      "gender",
      "employmentType",
      "officeLocation",
      "jobRole",
      "fixedSalaryLakhs",
      "fixedSalaryThousands",
      "variableSalaryLakhs",
      "variableSalaryThousands",
      "salaryYear",
      "offerType",
    ];

    controlsToValidate.forEach((controlName) => {
      if (this.salaryDetailing.controls[controlName].status === "INVALID") {
        this.isFormValueInvalid[controlName] = true;
      }
    });
  }

  processFormData(data: any) {
    const { fixedSalaryLakhs, fixedSalaryThousands, variableSalaryLakhs, variableSalaryThousands, ...rest } = data;
    const finalData = {
      ...rest,
      fixedSalary: parseInt(fixedSalaryLakhs) + parseInt(fixedSalaryThousands),
      variableSalary: parseInt(variableSalaryLakhs) + parseInt(variableSalaryThousands),
    };
    console.log(finalData);
  }

  submit() {
    this.validateFormData();
    if (this.salaryDetailing.valid) {
      this.processFormData(this.salaryDetailing.value);
    } else {
      console.error("Form values are invalid.");
    }
  }

  ngOnDestroy(): void {}
}
