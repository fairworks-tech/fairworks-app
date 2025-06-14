import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRegistrationPayload, FormData } from './profile.types';

export interface Profile {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CreateProfileService {
  private apiUrl = 'api/profiles'; // Replace with your actual API endpoint
  private readonly SALT_LENGTH = 16;

  constructor(private http: HttpClient) { }

  private async hashPassword(password: string): Promise<{ hash: string; salt: string }> {
    // Generate a random salt
    const saltArray = new Uint8Array(this.SALT_LENGTH);
    crypto.getRandomValues(saltArray);
    const salt = Array.from(saltArray)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Convert password to buffer
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const saltBuffer = encoder.encode(salt);

    // Import the password as a key
    const key = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    // Derive the hash
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: 1000,
        hash: 'SHA-256'
      },
      key,
      256 // 32 bytes = 256 bits
    );

    // Convert hash to hex string
    const hash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return { hash, salt };
  }

  async transformFormDataToPayload(formData: FormData): Promise<UserRegistrationPayload> {
    const { hash, salt } = await this.hashPassword(formData.userLoginInfo.password);
    
    return {
      user: {
        authentication: {
          email: formData.userLoginInfo.email,
          password: hash,
          salt: salt
        },
        personalInfo: {
          firstName: formData.userInfo.firstName,
          lastName: formData.userInfo.lastName,
          location: {
            city: formData.userInfo.city,
            country: formData.userInfo.country
          },
          contact: {
            phoneCode: formData.userInfo.phoneCode,
            phoneNumber: formData.userInfo.phone
          }
        },
        experience: formData.userExpForm.map((exp, index) => ({
          id: index + 1,
          jobTitle: exp.jobTitle,
          company: exp.organisation,
          employmentType: exp.jobType,
          location: exp.location,
          workArrangement: exp.locationType,
          startDate: {
            month: exp.jobStartMonth,
            year: parseInt(exp.jobStartYear, 10)
          },
          endDate: {
            month: exp.isCurrentJob ? null : exp.jobEndMonth || null,
            year: exp.isCurrentJob ? null : (exp.jobEndYear ? parseInt(exp.jobEndYear, 10) : null)
          },
          isCurrentPosition: exp.isCurrentJob,
          description: exp.jobDesc || ""
        })),
        education: formData.userEduForm.map((edu, index) => ({
          id: index + 1,
          institution: edu.institution,
          degree: edu.degree,
          fieldOfStudy: edu.specialization,
          startDate: {
            month: edu.eduStartMonth,
            year: edu.eduStartYear
          },
          endDate: {
            month: edu.eduEndMonth,
            year: edu.eduEndYear
          },
          grade: edu.grade || ""
        }))
      }
    };
  }

  createProfile(profile: FormData): Observable<any> {
    return new Observable(observer => {
      this.transformFormDataToPayload(profile)
        .then(payload => {
          this.http.post<any>(this.apiUrl, payload)
            .subscribe({
              next: (response) => observer.next(response),
              error: (error) => observer.error(error),
              complete: () => observer.complete()
            });
        })
        .catch(error => observer.error(error));
    });
  }
}
