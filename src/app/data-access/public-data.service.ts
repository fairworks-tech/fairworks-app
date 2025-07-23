import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  cca2: string;
  idd: {
    root: string;
    suffixes?: string[];
  };
}

@Injectable({
  providedIn: "root",
})
export class PublicDataService {
  private readonly countriesApiUrl = "https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2";

  constructor(
    private readonly http: HttpClient
  ) {}

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.countriesApiUrl);
  }
}
