import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CreateProfileComponent } from './create-profile.component';
import { UtilService } from 'src/app/shared/services/utils.service';
import { CreateProfileService } from 'src/app/dataaccess/create-profile.service';
import { of, throwError } from 'rxjs';

describe('CreateProfileComponent', () => {
  let component: CreateProfileComponent;
  let fixture: ComponentFixture<CreateProfileComponent>;
  let utilService: jest.Mocked<UtilService>;
  let createProfileService: jest.Mocked<CreateProfileService>;

  beforeEach(async () => {
    const utilServiceSpy = {
      isValidEmail: jest.fn()
    };
    const createProfileServiceSpy = {
      createProfile: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CreateProfileComponent
      ],
      providers: [
        FormBuilder,
        { provide: UtilService, useValue: utilServiceSpy },
        { provide: CreateProfileService, useValue: createProfileServiceSpy }
      ]
    }).compileComponents();

    utilService = TestBed.inject(UtilService) as jest.Mocked<UtilService>;
    createProfileService = TestBed.inject(CreateProfileService) as jest.Mocked<CreateProfileService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with empty values', () => {
      expect(component.profiling).toBeTruthy();
      expect(component.profiling.get('userLoginInfo')).toBeTruthy();
      expect(component.profiling.get('userInfo')).toBeTruthy();
      expect(component.profiling.get('userExpForm')).toBeTruthy();
      expect(component.profiling.get('userEduForm')).toBeTruthy();
    });

    it('should initialize with one experience and education form', () => {
      expect(component.expList.length).toBe(1);
      expect(component.eduList.length).toBe(1);
    });
  });

  describe('Step Navigation', () => {
    it('should start at step 1', () => {
      expect(component.stepper.currentStep).toBe(1);
    });

    it('should move to next step when form is valid', () => {
      const validLoginInfo = {
        email: 'test@example.com',
        password: 'Test@123',
        rePassword: 'Test@123'
      };
      component.profiling.get('userLoginInfo')?.patchValue(validLoginInfo);
      utilService.isValidEmail.mockReturnValue(true);
      
      component.processStep1();
      expect(component.stepper.currentStep).toBe(2);
    });

    it('should not move to next step when form is invalid', () => {
      const invalidLoginInfo = {
        email: 'invalid-email',
        password: 'weak',
        rePassword: 'weak'
      };
      component.profiling.get('userLoginInfo')?.patchValue(invalidLoginInfo);
      utilService.isValidEmail.mockReturnValue(false);
      
      component.processStep1();
      expect(component.stepper.currentStep).toBe(1);
    });
  });

  describe('Form Validation', () => {
    it('should validate email format', () => {
      const emailControl = component.profiling.get('userLoginInfo.email');
      emailControl?.setValue('invalid-email');
      utilService.isValidEmail.mockReturnValue(false);
      
      component.isValidEmail();
      expect(component.isStep1Invalid['email']).toBeTruthy();
    });

    it('should validate password requirements', () => {
      const passwordControl = component.profiling.get('userLoginInfo.password');
      passwordControl?.setValue('weak');
      
      component.processStep1();
      expect(component.isStep1Invalid['password']).toBeTruthy();
    });

    it('should validate password match', () => {
      const loginInfo = {
        email: 'test@example.com',
        password: 'Test@123',
        rePassword: 'Different@123'
      };
      component.profiling.get('userLoginInfo')?.patchValue(loginInfo);
      
      component.processStep1();
      expect(component.isStep1Invalid['rePassword']).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    it('should submit form when all steps are valid', () => {
      const mockResponse = { success: true };
      createProfileService.createProfile.mockReturnValue(of(mockResponse));

      // Set valid form values
      const validFormData = {
        userLoginInfo: {
          email: 'test@example.com',
          password: 'Test@123',
          rePassword: 'Test@123'
        },
        userInfo: {
          firstName: 'John',
          lastName: 'Doe',
          city: 'New York',
          country: 'USA',
          phoneCode: '+1',
          phone: '1234567890'
        },
        userExpForm: [{
          jobTitle: 'Developer',
          organisation: 'Company',
          jobType: 'Full-time',
          location: 'New York',
          locationType: 'Remote',
          jobStartMonth: '01',
          jobStartYear: '2020',
          isCurrentJob: true,
          jobEndMonth: '',
          jobEndYear: '',
          jobDesc: 'Description'
        }],
        userEduForm: [{
          institution: 'University',
          degree: 'Bachelor',
          specialization: 'Computer Science',
          eduStartMonth: '09',
          eduStartYear: 2016,
          eduEndMonth: '05',
          eduEndYear: 2020,
          grade: '3.8'
        }]
      };

      component.profiling.patchValue(validFormData);
      component.submit();

      expect(createProfileService.createProfile).toHaveBeenCalledWith(validFormData);
      expect(component.creatingProfile).toBeFalse();
    });

    it('should handle submission error', () => {
      createProfileService.createProfile.mockReturnValue(throwError(() => new Error('Submission failed')));
      
      component.submit();
      
      expect(component.creatingProfile).toBeFalse();
    });
  });

  describe('Helper Methods', () => {
    it('should add new education form', () => {
      const initialLength = component.eduList.length;
      component.addEdu();
      expect(component.eduList.length).toBe(initialLength + 1);
    });

    it('should reset step errors', () => {
      component.setStepError(1, 'email', 'Invalid email');
      component.resetStepErrors(1);
      expect(component.isStep1Invalid['email']).toBeFalsy();
      expect(component.hasStep1Error['email']).toBeNull();
    });
  });
});
