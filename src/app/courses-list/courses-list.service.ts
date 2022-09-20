import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { SimpleCourse } from './SimpleCourse.model';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private http: HttpClient) {}
  getBasicCourses() {
    return this.http
      .get<SimpleCourse[]>(
        'https://technoid-2022-default-rtdb.firebaseio.com//simple-courses.json'
      )
      .pipe(
        map((coursesLinks) => {
          return coursesLinks;
        })
      );
  }
  getNestedCourses() {
    return this.http
      .get<any>(
        'https://technoid-2022-default-rtdb.firebaseio.com//nested-courses.json'
      )
      .pipe(
        map((coursesLinks) => {
          return coursesLinks;
        })
      );
  }
}