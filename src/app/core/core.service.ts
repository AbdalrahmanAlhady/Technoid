import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  constructor(private http: HttpClient,private authService:AuthService) {}

  getFieldDesc(fieldName: string) {

    return this.http
      .get<{ [key: string]: string }>(
        'https://technoid-2022-default-rtdb.firebaseio.com/description.json'

      )
      .pipe(
        map((fieldDescs) => {
          return fieldDescs[fieldName];
        })
      );

    
  }
  getFieldLanguages(fieldName: string) {
    return this.http
      .get<{ [key: string]: string }>(
        'https://technoid-2022-default-rtdb.firebaseio.com/field.json'
      )
      .pipe(
        map((fieldLanguages) => {
          return fieldLanguages[fieldName];
        })
      );

    
  } 
  getBackendLangByRegion() {
    return this.http
      .get<
         { [key: string]: 
          [{ [key: string]: string }] } >(
        'https://technoid-2022-default-rtdb.firebaseio.com/countries.json'
      )
      .pipe(
        map((languagesByRegion) => {
          return languagesByRegion;
        })
      );


  }

}
