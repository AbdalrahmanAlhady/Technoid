import { Component, Input, OnInit } from '@angular/core';
import { SimpleCourse } from '../SimpleCourse.model';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit {
  @Input() simpleCourse!: SimpleCourse;
  @Input() nestedCourses!: any[];
  @Input() nestedCourse: boolean = false;
  @Input() trackName: string = '';

  constructor() {}

  ngOnInit(): void {
    
    if (this.nestedCourses) {
      this.trackName.toLowerCase() === 'c sharp track'
        ? (this.trackName = 'C# track')
        : (this.trackName = this.trackName);
    }
  }
}
