import { Component, OnDestroy, OnInit, SimpleChange } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuestionsFormType } from '../core/QuestionsForm.model';
import { PassingData } from '../shared/passingData.service';
import { CoursesService } from './courses-list.service';
import { SimpleCourse } from './SimpleCourse.model';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css'],
})
export class CoursesListComponent implements OnInit, OnDestroy {
  basicCourses: SimpleCourse[] = [];
  nestedCourses: Array<SimpleCourse[]> = [];

  trackNames: string[] = [];

  fieldName: String = '';
  fieldLangs: string[] = [];
  firstAnswer: boolean = false;
  showSpinner: boolean = false;
  showContent: boolean = false;
  choosenRegion!: string;
  subscriptions: Subscription[] = [];

  userID: string = JSON.parse(localStorage.getItem('userData') || '{}').id;
  loadedQuestionsData!: QuestionsFormType;

  constructor(
    private passDataService: PassingData,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    this.showSpinner = true;

    this.passDataService.checkIfDataSaved(this.userID).subscribe({
      next: (isDataSaved: boolean) => {
        if (isDataSaved) {
          this.getSavedCoursesData();
        } else {
          this.fieldName = this.passDataService.getFieldName();
          this.fieldLangs = this.passDataService.getFieldLangs();
          this.firstAnswer = this.passDataService.getFirstAnswer();
          if (this.fieldName.toLowerCase() === 'back-end') {
            this.choosenRegion = this.passDataService.getChoosenRegion();
            const temp = this.passDataService.getLangsOfRegion();
            this.fieldLangs = Object.keys(temp).map((key) => {
              return temp[key];
            });
          } else {
            this.fieldLangs = this.passDataService.getFieldLangs();
          }
        }
      },
      error: (error) => {},
    });

    setTimeout(() => {
      this.setBasicCoursesLinks();
      this.setNestedCourses();
      this.showSpinner = false;
      this.showContent = true;
    }, 2000);
    
  }

  setBasicCoursesLinks() {
    this.subscriptions.push(
      this.coursesService.getBasicCourses().subscribe((basicCourses) => {
        this.basicCourses = basicCourses;
      })
    );
  }

  setNestedCourses() {
    this.subscriptions.push(
      this.coursesService.getNestedCourses().subscribe((nestedCourses) => {
        let keys = Object.keys(nestedCourses);

        if (
          this.fieldName.toLowerCase() === 'front-end' ||
          this.fieldName.toLowerCase() === 'android'
        ) {
          keys.forEach((key) => {
            // front-end and android courses
            if (key.toLowerCase().includes(this.fieldName.toLowerCase())) {
              if (!this.trackNames.includes(key)) {
                this.trackNames.push(key);
              }
              this.nestedCourses.push(nestedCourses[key]);
            }
          });
        } else if (
          this.fieldName.toLowerCase() !== 'front-end' &&
          this.fieldName.toLowerCase() !== 'android'
        ) {
          this.fieldLangs.forEach((lang) => {
            keys.forEach((key) => {
              lang.toLowerCase() === 'c#' ? (lang = 'C sharp') : (lang = lang);
              lang.toLowerCase() === 'javascript'
                ? (lang = 'nodejs')
                : (lang = lang);
              if (key.toLowerCase().includes('android')) {
                return;
              }
              if (key.toLowerCase() === lang.toLowerCase() + ' track') {
                if (!this.trackNames.includes(key)) {
                  this.trackNames.push(key);
                }

                this.nestedCourses.push(nestedCourses[key]);
                // android
              } else if (
                key.toLowerCase() ===
                  'android ' + lang.toLowerCase() + ' track' &&
                this.fieldName.toLowerCase() !== 'android'
              ) {
                return;
              }
            });
          });
        }
      })
    );
  }

  getSavedCoursesData() {
    this.subscriptions.push(
      this.passDataService
        .getQuestionData(this.userID)
        .subscribe((questionsData) => {
          this.loadedQuestionsData = questionsData;
        })
    );
    setTimeout(() => {
      if (this.loadedQuestionsData) {
        this.firstAnswer = this.loadedQuestionsData.answerOne;
        this.fieldName = this.loadedQuestionsData.fieldName;
        this.choosenRegion = this.loadedQuestionsData.region!;

        if (this.fieldName.toLowerCase() === 'back-end') {
          const temp = this.loadedQuestionsData.langsOfRegion!;
          this.fieldLangs = Object.keys(temp).map((key) => {
            return temp[key];
          });
        } else {
          this.fieldLangs = this.loadedQuestionsData.fieldLangs!;
        }
      }
    }, 200);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
