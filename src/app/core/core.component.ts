import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CoreService } from './core.service';
import { Router } from '@angular/router';
import { PassingData } from '../shared/passingData.service';
import { QuestionsForm, QuestionsFormType } from './QuestionsForm.model';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { QuestionComponent } from './question/question.component';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css'],
})
export class CoreComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('stepOne') stepOne!: ElementRef;
  @ViewChild('stepTwo') stepTwo!: ElementRef;
  @ViewChild('stepThree') stepThree!: ElementRef;
  @ViewChild('progress1') progress1!: ElementRef;
  @ViewChild('Q&A1') q1!: ElementRef;
  @ViewChild('arrow1') arrow1!: ElementRef;
  @ViewChild('arrow2') arrow2!: ElementRef;
  @ViewChild(QuestionComponent) question!: QuestionComponent;

  firstAnswer!: boolean;
  disableFirstNext: boolean = true;
  resultColor!: String;
  hideQ1: boolean = false;
  hideQ2Part1: boolean = false;
  hideQ2Part2: boolean = false;
  showQ2Part1: boolean = false;
  showQ2Part2: boolean = false;
  isQ2Part2Used: boolean = false;
  showQ2Part2Arrow: boolean = false;
  fieldName: string = '';
  fieldDesc: string = '';
  fieldLanguages!: string[];
  showConclusion: boolean = false;
  showSpinner: boolean = false;
  langsOfBackend!: { [key: string]: [{ [key: number]: string }] };
  langsOfRegion: [{ [key: number]: string }] = [{}];
  selectedRegion: string = '';
  dropDownTitle: string = 'Select a region';
  userID!: string;
  loadedQuestionsData!: QuestionsFormType;
  loadingData: boolean = true;
  subscriptions: Subscription[] = [];

  countries:string[]=['Asia','Egypt & NorthAfrica','Europe','USA'];

  constructor(
    private render: Renderer2,
    private coreService: CoreService,
    private router: Router,
    private passDataService: PassingData
  ) {}

  ngOnInit(): void {
    this.userID = JSON.parse(localStorage.getItem('userData') || '{}').id;
    this.subscriptions.push(
      this.passDataService.checkIfDataSaved(this.userID).subscribe({
        next: (isDataSaved: boolean) => {
          if (isDataSaved) {
            this.getSavedQuestions();
          }
        },
        error: (error) => {},
      })
    );
  }
  ngAfterViewInit() {
    this.subscriptions.push(
      this.passDataService
        .checkIfDataSaved(this.userID)
        .subscribe((isDataSaved: boolean) => {
          if (!isDataSaved) {
            this.render.addClass(this.stepOne?.nativeElement, 'active');
            this.loadingData = false;
          } else {
            setTimeout(() => {
              if (this.loadedQuestionsData.isq2part2) {
                this.showQ2Part2Arrow = true;
              }
            }, 500);
          }
        })
    );
  }
  advanceTo2(firstAnswer?:boolean) {
    this.firstAnswer = firstAnswer!;
    this.firstAnswer
      ? (this.resultColor = '#25C03E')
      : (this.resultColor = '#FD0202');

    this.render.removeClass(this.stepOne?.nativeElement, 'active');
    this.render.addClass(this.stepOne?.nativeElement, 'done');
    this.render.addClass(this.stepTwo?.nativeElement, 'active');
    this.render.setAttribute(this.progress1?.nativeElement, 'value', '50');
    this.hideQ1 = true;
    this.showQ2Part1 = true;
  }
  advanceTo2Part2() {
    this.hideQ2Part1 = true;
    this.showQ2Part2 = true;
    this.isQ2Part2Used = true;
    // this.render.setAttribute(this.arrow2.nativeElement, 'fill', '#878787');
  }

  advanceTo3(savedData?: boolean) {
    
    this.render.removeClass(this.stepTwo?.nativeElement, 'active');
    this.render.addClass(this.stepTwo?.nativeElement, 'done');
    this.render.addClass(this.stepThree?.nativeElement, 'active');
    this.render.setAttribute(this.progress1?.nativeElement, 'value', '100');
    this.hideQ2Part1 = true;
    this.hideQ2Part2 = true;
    savedData ? (this.showSpinner = false) : (this.showSpinner = true);
    this.passData();
    setTimeout(() => {
      this.showSpinner = false;
      this.showConclusion = true;
    }, 1600);

    // get field description
    this.subscriptions.push(
      this.coreService
        .getFieldDesc(this.fieldName.toLowerCase())
        .subscribe((fd) => {
          this.fieldDesc = fd;
        })
    );
    if (this.fieldName) {
      // get languages names
      this.subscriptions.push(
        this.coreService
          .getFieldLanguages(this.fieldName.toLowerCase())
          .subscribe((fl) => {
            if (fl) {
              if (this.fieldName.toLowerCase() === 'back-end') {
                this.fieldLanguages = [];
              } else {
                this.fieldLanguages = fl.split(' ');
              }
            }
          })
      );
    }

    this.subscriptions.push(
      this.coreService.getBackendLangByRegion().subscribe((langsOfRegion) => {
        this.langsOfBackend = langsOfRegion;
      })
    );
  }

  setFieldName(nameORIsSaved?: any) {
    if (typeof nameORIsSaved == 'boolean') {
      this.evaluateFieldChoice(nameORIsSaved);
    } else {
      nameORIsSaved
        ? (this.fieldName = nameORIsSaved)
        : this.fieldName === this.fieldName;
      this.evaluateFieldChoice();
    }
  }

  evaluateFieldChoice(savedData?: boolean) {
    if (this.fieldName !== 'none') {
      this.advanceTo3(savedData);
      // q2arrow color
    } else {
      this.advanceTo2Part2();
      // q2arrow color
      // q3arrow color
    }
  }

  getBackendLangs() {
    this.dropDownTitle = this.selectedRegion;
    this.langsOfRegion = this.langsOfBackend[this.selectedRegion];
  }
  goToCourses() {
    this.saveQuestionsData();
    setTimeout(() => {
      this.router.navigate(['courses']);
    }, 400);
  }

  saveQuestionsData() {
    this.passData();
    setTimeout(() => {
      this.passDataService.saveQuestions();
    }, 200);
  }

  passData() {
    this.passDataService.setFieldName(this.fieldName);
    this.passDataService.setFirstAnswer(this.firstAnswer);
    this.passDataService.setFieldDesc(this.fieldDesc);
    this.passDataService.setIsQ2Part2Used(this.isQ2Part2Used);
    if (this.fieldName.toLowerCase() === 'back-end') {
      this.passDataService.setChoosenRegion(this.selectedRegion);
      this.passDataService.setLangsOfRegion(this.langsOfRegion);
    } else {
      this.passDataService.setFieldLangs(this.fieldLanguages);
    }
  }
  resetQuestions() {
    this.loadingData = false;
    this.subscriptions.push(
      this.passDataService.deleteQuestionData(this.userID).subscribe((d) => {})
    );
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  getSavedQuestions() {
    this.subscriptions.push(
      this.passDataService
        .getQuestionData(this.userID)
        .subscribe((questionsData) => {
          this.loadedQuestionsData = questionsData;
        })
    );

    setTimeout(() => {
      this.firstAnswer = this.loadedQuestionsData.answerOne;
      this.fieldName = this.loadedQuestionsData.fieldName;
      this.fieldDesc = this.loadedQuestionsData.fieldDesc;
      this.selectedRegion = this.loadedQuestionsData.region!;
      this.dropDownTitle = this.loadedQuestionsData.region!;

      if (this.fieldName.toLocaleLowerCase() !== 'back-end') {
        this.fieldLanguages = this.loadedQuestionsData.fieldLangs!;
      } else {
        this.selectedRegion = this.loadedQuestionsData.region!;
        this.langsOfRegion = this.loadedQuestionsData.langsOfRegion!;
      }

      this.hideQ1 = true;
      this.hideQ2Part1 = true;
      this.hideQ2Part2 = true;
      this.showConclusion = true;
      this.advanceTo2();
      this.question.advanceToNextQuestion();
      this.setFieldName(true);
      
      this.loadingData = false;
    }, 500);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
