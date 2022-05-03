import { Component, OnInit } from '@angular/core';
import { ObjectUnsubscribedError, timeout, toArray } from 'rxjs';
import { PassingData } from '../shared/passingData.service';
import { CoursesService } from './courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  fieldName: String = '';
  fieldLangs: string[] = [];
  firstAnswer: boolean = false;
  showSpinner: boolean = false;
  showContent: boolean = false;
  choosenRegion: string = '';
  basicCoursesLinks: { [key: string]: string } = { CS50: '', DSA: '' };
  coursesLinks: { [key: string]: string } = {};
  manyCoursesLinks: [{ [key: string]: string }] = [{}];
  backendORCrossCoursesLinks: { [key: string]: [{ [key: string]: string }] } = {};
  dbCoursesLinks:[{ [key: string]: string }]=[{}];
  constructor(
    private passDataService: PassingData,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    this.showSpinner = true;
    setTimeout(() => {
      this.showSpinner = false;
      this.showContent = true;
    }, 1600);

    // if (!!localStorage.getItem('questionsForm')) {

    //   this.getSavedCoursesData();
    //   console.log(this.fieldLangs);
      
    // }else{
      this.fieldName = this.passDataService.getFieldName();
    this.firstAnswer = this.passDataService.getFirstAnswer();
    // }

    

    this.setBasicCoursesLinks();
    if (this.fieldName.toLowerCase() === 'back-end') {
      this.choosenRegion = this.passDataService.getChoosenRegion();
      const temp = this.passDataService.getLangsOfRegion();
      this.fieldLangs = Object.keys(temp).map((key) => {
        return temp[key];
      });
      this.setBackEndCourseLinks();
    } else if (this.fieldName.toLowerCase() === 'cross-platform') {
      this.fieldLangs = this.passDataService.getFieldLangs();
      this.setCrossPlatformCourses();
    } else {
      this.fieldLangs = this.passDataService.getFieldLangs();
      this.setMainCoursesLinks();
    }
    this.setDBCourses();
  }
  setBasicCoursesLinks() {
    if (!this.firstAnswer) {
      this.coursesService.getCourseLink().subscribe((links) => {
        this.basicCoursesLinks['CS50'] = links['CS50'];
        this.basicCoursesLinks['DSA'] = links['DSA'];
      });
    }
  }
  setMainCoursesLinks() {
    if (
      this.fieldName.toLowerCase() === 'front-end' ||
      this.fieldName.toLowerCase() === 'ios'
    ) {
      this.coursesService.getCourseLink().subscribe((links) => {
        this.fieldLangs.forEach((lang) => {
          if (this.fieldName.toLowerCase() === 'front-end') {
            this.coursesLinks[lang + ''] = links[lang + ''];
            if (lang.toLowerCase() === 'javascript') {
              this.coursesLinks[lang + ''] = links[lang + '-f'];
            }
          } else {
            this.coursesLinks[lang + ''] = links[lang + ''];
          }
        });
      });
    } else if (this.fieldName.toLowerCase() === 'android') {
      this.coursesService.getManyCourseLink().subscribe((links) => {
        this.manyCoursesLinks = links[this.fieldName.toLowerCase()];
      });
    }
  }
  setBackEndCourseLinks() {
    if (this.fieldName.toLowerCase() === 'back-end') {
      this.fieldLangs.forEach((lang) => {
        if (lang.toLowerCase() === 'php') {
          this.coursesService.getCourseLink().subscribe((links) => {
            this.coursesLinks[lang] = links[lang];
          });
        } else {
          this.coursesService.getBackEndCourseLink().subscribe((links) => {
            this.backendORCrossCoursesLinks = links;
          });
        }
       
      });
    }
  }
  setCrossPlatformCourses() {
    if (this.fieldName.toLowerCase() === 'cross-platform') {
      this.coursesService.getBackEndCourseLink().subscribe((links) => {
        this.backendORCrossCoursesLinks = links;      
      });
    } 
  }
  setDBCourses(){
    this.coursesService.getDBCourseLink().subscribe((links)=>{
       this.dbCoursesLinks = links; 
    })
  }
  getSavedCoursesData(){
    const loadedQuestionsData: {
      answerOne: boolean;
      fieldName: string;
      fieldDesc: string;
      fieldLangs: string[];
      isq2part2: boolean;
    } = JSON.parse(localStorage.getItem('questionsForm') || '{}');
    this.firstAnswer = loadedQuestionsData.answerOne;
    this.fieldName = loadedQuestionsData.fieldName;
  }
}
