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
  public yearsOfExp: any;
  public salaryValLakhs: any;
  public salaryValThousands: any;
  public salaryYears: any;

  constructor(private fb: FormBuilder) {
    this.companyListAuto = FW_COMPANIES;
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
      department: ["", [Validators.required]],
      fixedSalaryLakhs: ["", [Validators.required]],
      fixedSalaryThousands: ["", [Validators.required]],
      variableSalaryLakhs: ["", [Validators.required]],
      variableSalaryThousands: ["", [Validators.required]],
      hasStocks: ["", [Validators.required]],
      salaryYear: ["", [Validators.required]],
      lastIncrement: ["", [Validators.required]],
      lastIncrementYear: ["", [Validators.required]],
    });
  }

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

  structSalThousands() {
    return Array.from({ length: 19 }, (_, i) => {
      const val = (i + 1) * 5000;
      return { val, text: `${(i + 1) * 5} Thousands` };
    });
  }

  structSalaryYears() {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i);
  }

  processData(data: any) {
    const {
      fixedSalaryLakhs,
      fixedSalaryThousands,
      variableSalaryLakhs,
      variableSalaryThousands,
      ...rest
    } = data;
    const finalData = {
      ...rest,
      fixedSalary: parseInt(fixedSalaryLakhs) + parseInt(fixedSalaryThousands),
      variableSalary:
        parseInt(variableSalaryLakhs) + parseInt(variableSalaryThousands),
    };
    console.log(finalData);
  }

  submit() {
    this.processData(this.salaryDetailing.value);
  }

  ngOnDestroy(): void {}
}
