import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FW_COUNTRIES } from 'src/app/config/fw.countries';
import { FW_PHONECODES } from 'src/app/config/fw.phonecodes';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit, OnDestroy {

  public profiling!: FormGroup;
  public expList!: FormArray;
  public eduList!: FormArray;
  public countryList: any;
  public phoneCodeList: any;
  public selectedCountry: any;
  public startYear = new Date().getFullYear();
  public yearRange: any = [];
  public monthRange: any = [
    {id:'01', name:'January'}, 
    {id:'02', name:'February'}, 
    {id:'03', name:'March'},
    {id:'04', name:'April'},
    {id:'05', name:'May'}, 
    {id:'06', name:'June'}, 
    {id:'07', name:'July'},
    {id:'08', name:'August'},
    {id:'09', name:'September'},
    {id:'10', name:'October'},
    {id:'11', name:'November'},
    {id:'12', name:'December'}
  ];

  stepper = {
    currentStep: 1,
    maxStep: 4,
    status: 'clean' //clean, progress, complete
  }

  helperText = {
    'password': 'Min 8 and max 20 characters. At least one lowercase, uppercase, number and any of the following special character @%+\/’!#$^?:,(){}[]~-_.'
  }

  constructor(
    private elRef: ElementRef,
    private fb: FormBuilder
  ) { 
    this.countryList = FW_COUNTRIES;
    this.phoneCodeList = FW_PHONECODES;
  }

  ngOnInit(): void {
    this.setYearRange();

    this.profiling = this.fb.group({
      userLoginInfo: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
        ]],
        rePassword: ['', [
          Validators.required, 
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
        ]],
      }),
      userInfo: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        city: ['', [Validators.required]],
        country: ['', [Validators.required]],
        phoneCode: ['', [Validators.required]],
        phone: ['', [Validators.required]]
      }),
      userExpForm: this.fb.array([this.initExpForm()]),
      userEduForm: this.fb.array([this.initEduForm()]),
    });

    this.expList = this.profiling.get('userExpForm') as FormArray;
    this.eduList = this.profiling.get('userEduForm') as FormArray; 
  }

  // get country() {
  //   return this.profiling.get('userInfo')?.get('country');
  // }

  initExpForm(): FormGroup {
    return this.fb.group({
      jobTitle: ['', [Validators.required]],
      jobType: ['', Validators.required],
      organisation: ['', [Validators.required]],
      location: ['', Validators.required],
      locationType: ['', Validators.required],
      jobStartMonth: ['', [Validators.required]],
      jobStartYear: ['', [Validators.required]],
      jobEndMonth: ['', [Validators.required]],
      jobEndYear: ['', [Validators.required]],
      jobDesc: ['', [Validators.required]]
    });
  }

  addExp() {
    this.expList.push(this.initExpForm()); 
  }

  removeExp(index: number) {
    this.expList.removeAt(index);  
  }

  get experienceFormGroup() {
    return this.profiling.get('userExpForm') as FormArray;
  }

  initEduForm(): FormGroup {
    return this.fb.group({
      institution: ['', [Validators.required]],
      degree: ['', Validators.required],
      specialization: ['', Validators.required],
      eduStartMonth: ['', [Validators.required]],
      eduStartYear: ['', [Validators.required]],
      eduEndMonth: ['', Validators.required],
      eduEndYear: ['', Validators.required],
      grade: ['', Validators.required],
      activities: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  addEdu() {
    this.eduList.push(this.initEduForm());
  }

  removeEdu(index: number) {
    this.eduList.removeAt(index);
  }

  get educationFormGroup() {
    return this.profiling.get('userEduForm') as FormArray;
  }

  setYearRange() {
    for (let i = 0; i < 100; i++) {
      this.yearRange.push(this.startYear - i);
    }
  }

  save() {
    console.log(this.profiling.value);
  }

  gotoNext() {
    this.save();
    this.stepper.currentStep = this.stepper.currentStep + 1;
  }

  gotoPrev() {
    this.stepper.currentStep = this.stepper.currentStep - 1;
  }

  submit() {
    console.log(this.profiling.value);
  }

  ngOnDestroy(): void {
    
  }

  isUserExists() {
    
  }



  /**
   * The below code for future purpose and it is half-baked
   * The below code is to show the country phone code along with flags
   */
  selectedCodeItem:any = null;
  showCodeOptions: boolean = false;
  selectCode(item: any) {
    this.selectedCodeItem = item;
    this.showCodeOptions = false;
  }
  
  
}

