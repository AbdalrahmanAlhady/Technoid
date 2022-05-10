import { Component, OnInit } from '@angular/core';
import { QuestionsFormType } from '../core/QuestionsForm.model';
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
  choosenRegion!: string;
  basicCoursesLinks: { [key: string]: string } = { CS50: '', DSA: '' };
  coursesLinks: { [key: string]: string } = {};
  manyCoursesLinks: [{ [key: string]: string }] = [{}];
  backendORCrossCoursesLinks: { [key: string]: [{ [key: string]: string }] } =
    {};
  dbCoursesLinks: [{ [key: string]: string }] = [{}];
  userID: string = JSON.parse(localStorage.getItem('userData') || '{}').id;
  loadedQuestionsData!: QuestionsFormType;
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
    this.passDataService.checkIfDataSaved(this.userID).subscribe({
      next: (isDataSaved: boolean) => {
        if (isDataSaved) {
          this.getSavedCoursesData();
          setTimeout(() => {
            console.log(this.loadedQuestionsData);

            console.log(this.fieldLangs);
            console.log(this.fieldName);
            console.log(this.firstAnswer);
          }, 1500);
        } else {
          console.log('eles');

          this.fieldName = this.passDataService.getFieldName();
          this.firstAnswer = this.passDataService.getFirstAnswer();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });

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
  setDBCourses() {
    this.coursesService.getDBCourseLink().subscribe((links) => {
      this.dbCoursesLinks = links;
    });
  }
  getSavedCoursesData() {
    this.passDataService
      .getQuestionData(this.userID)
      .subscribe((questionsData) => {
        this.loadedQuestionsData = questionsData;
      });
    setTimeout(() => {
      this.firstAnswer = this.loadedQuestionsData.answerOne;
      this.fieldName = this.loadedQuestionsData.fieldName;
      this.choosenRegion = this.loadedQuestionsData.region!;

      if (this.fieldName.toLowerCase() === 'back-end') {
        const temp = this.loadedQuestionsData.langsOfRegion!;
        this.fieldLangs = Object.keys(temp).map((key) => {
          return temp[key];
        });
        this.setBackEndCourseLinks();
        
      } else {
        this.fieldLangs = this.loadedQuestionsData.fieldLangs!;
        this.setMainCoursesLinks();
        this.setCrossPlatformCourses();
      }
    }, 1500);
  }
}
