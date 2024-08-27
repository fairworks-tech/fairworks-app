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
  public employmentType: any;
  public totalExp: any;
  public fixedSalary: any;
  public variableSalary: any;
  public hasStocks: any;
  public salaryYear: any;
  public lastIncrement: any;
  public lastIncrementYear: any;
  public gender: any;
  public officeLocation: any;
  public department: any;

  public companyListAuto: any;
  public salaryValLakhs: any;
  public salaryValThousands: any;
  public salaryYears: any;

  constructor(private fb: FormBuilder) {
    this.companyListAuto = FW_COMPANIES;
  }

  ngOnInit(): void {
    this.salaryValLakhs = this.structSalLakhs();
    this.salaryValThousands = this.structSalThousands();
    this.salaryYears = this.structSalaryYears();

    this.salaryDetailing = this.fb.group({
      company: ["", [Validators.required]],
      jobTitle: ["", [Validators.required]],
      employmentType: ["", [Validators.required]],
      totalExp: ["", [Validators.required]],
      fixedSalaryLakhs: ["", [Validators.required]],
      fixedSalaryThousands: ["", [Validators.required]],
      variableSalaryLakhs: ["", [Validators.required]],
      variableSalaryThousands: ["", [Validators.required]],
      hasStocks: ["", [Validators.required]],
      salaryYear: ["", [Validators.required]],
      lastIncrement: ["", [Validators.required]],
      lastIncrementYear: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      officeLocation: ["", [Validators.required]],
      department: ["", [Validators.required]],
    });
  }

  structSalLakhs() {
    let amountStruct = [];
    for (let i = 0; i < 100; i++) {
      let val = i === 0 || i === 1 ? i + " Lakh" : i + " Lakhs";
      amountStruct.push(val);
    }
    for (let i = 1; i <= 5; i += 0.1) {
      let val = parseFloat(i.toFixed(1)) + " Cr";
      amountStruct.push(val);
    }
    return amountStruct;
  }

  structSalThousands() {
    let amountStruct = [];
    for (let i = 5; i < 100; i += 5) {
      let val = i + " Thousands";
      amountStruct.push(val);
    }
    return amountStruct;
  }

  structSalaryYears() {
    let yearsStruct = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i > currentYear - 6; i--) {
      let val = i;
      yearsStruct.push(val);
    }
    return yearsStruct;
  }

  submit() {
    console.log(this.salaryDetailing.value);
  }

  ngOnDestroy(): void {}
}
