import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
    constructor(private http: HttpClient) {

    }
    getCourseLink() {
        return this.http
          .get<{ [key: string]: string }>(
            'https://technoid-2022-default-rtdb.firebaseio.com/courses.json'
          )
          .pipe(
            map((coursesLinks) => {
              return coursesLinks;
            })
          );
    }
    getManyCourseLink() {
      return this.http
        .get<{ [key: string]: 
          [{ [key: string]: string }] }>(
          'https://technoid-2022-default-rtdb.firebaseio.com/courses.json'
        )
        .pipe(
          map((coursesLinks) => {
            return coursesLinks;
          })
        );
  }
  getBackEndCourseLink() {
    return this.http
      .get<{ [key: string]: 
        [{ [key: string]: string }] }>(
        'https://technoid-2022-default-rtdb.firebaseio.com/courses.json'
      )
      .pipe(
        map((coursesLinks) => {
          return coursesLinks;
        })
      );
}
getDBCourseLink() {
  return this.http
    .get<[{ [key: string]: string }]>(
      'https://technoid-2022-default-rtdb.firebaseio.com/DB-Courses.json'
    )
    .pipe(
      map((coursesLinks) => {
        return coursesLinks;
      })
    );
}

}