// Original form data interfaces
interface UserLoginInfo {
  email: string;
  password: string;
  rePassword: string;
}

interface UserInfo {
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  phoneCode: string;
  phone: string;
}

interface UserExpForm {
  jobTitle: string;
  organisation: string;
  jobType: string;
  location: string;
  locationType: string;
  jobStartMonth: string;
  jobStartYear: string;
  isCurrentJob: boolean;
  jobEndMonth: string;
  jobEndYear: string;
  jobDesc: string;
}

interface UserEduForm {
  institution: string;
  degree: string;
  specialization: string;
  eduStartMonth: string;
  eduStartYear: number;
  eduEndMonth: string;
  eduEndYear: number;
  grade: string;
}

export interface FormData {
  userLoginInfo: {
    email: string;
    password: string;
  };
  userInfo: {
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    phoneCode: string;
    phone: string;
  };
  userExpForm: Array<{
    jobTitle: string;
    organisation: string;
    jobType: string;
    location: string;
    locationType: string;
    jobStartMonth: string;
    jobStartYear: string;
    jobEndMonth?: string;
    jobEndYear?: string;
    isCurrentJob: boolean;
    jobDesc?: string;
  }>;
  userEduForm: Array<{
    institution: string;
    degree: string;
    specialization: string;
    eduStartMonth: string;
    eduStartYear: number;
    eduEndMonth: string;
    eduEndYear: number;
    grade?: string;
  }>;
}

// Target payload interfaces (from previous artifact)
interface DateInfo {
  month: string;
  year: number;
}

interface Experience {
  id: number;
  jobTitle: string;
  company: string;
  employmentType: string;
  location: string;
  workArrangement: string;
  startDate: DateInfo;
  endDate: {
    month: string | null;
    year: number | null;
  };
  isCurrentPosition: boolean;
  description: string;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: DateInfo;
  endDate: DateInfo;
  grade: string;
}

export interface UserRegistrationPayload {
  user: {
    authentication: {
      email: string;
      password: string;
      salt: string;
    };
    personalInfo: {
      firstName: string;
      lastName: string;
      location: {
        city: string;
        country: string;
      };
      contact: {
        phoneCode: string;
        phoneNumber: string;
      };
    };
    experience: Array<{
      id: number;
      jobTitle: string;
      company: string;
      employmentType: string;
      location: string;
      workArrangement: string;
      startDate: {
        month: string;
        year: number;
      };
      endDate: {
        month: string | null;
        year: number | null;
      };
      isCurrentPosition: boolean;
      description: string;
    }>;
    education: Array<{
      id: number;
      institution: string;
      degree: string;
      fieldOfStudy: string;
      startDate: {
        month: string;
        year: number;
      };
      endDate: {
        month: string;
        year: number;
      };
      grade: string;
    }>;
  };
}