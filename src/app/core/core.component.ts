import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CoreService } from './core.service';
import { Router } from '@angular/router';
import { PassingData } from '../shared/passingData.service';
import { QuestionsForm } from './QuestionsForm.model';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css'],
})
export class CoreComponent implements OnInit, AfterViewInit {
  @ViewChild('stepOne') stepOne!: ElementRef;
  @ViewChild('stepTwo') stepTwo!: ElementRef;
  @ViewChild('stepThree') stepThree!: ElementRef;
  @ViewChild('progress1') progress1!: ElementRef;
  @ViewChild('Q&A1') q1!: ElementRef;
  @ViewChild('arrow1') arrow1!: ElementRef;
  @ViewChild('arrow2') arrow2!: ElementRef;
  @ViewChild('dropDownTitle') dropDownTitle!: ElementRef;
  firstAnswer!: boolean;
  disableFirstNext: boolean = true;
  resultColor!: String;
  hideQ1: boolean = false;
  hideQ2Part1: boolean = false;
  hideQ2Part2: boolean = false;
  showQ2Part1: boolean = false;
  showQ2Part2: boolean = false;
  fieldName: string = '';
  fieldDesc: string = '';
  fieldLanguages!: string[];
  showConclusion: boolean = false;
  showSpinner: boolean = false;
  langsOfBackend!: { [key: string]: [{ [key: number]: string }] };
  langsOfRegion: [{ [key: number]: string }] = [{}];
  selectedRegion: string = '';
  constructor(
    private render: Renderer2,
    private coreService: CoreService,
    private router: Router,
    private passDataService: PassingData
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    setTimeout(() => {
      if (!!localStorage.getItem('questionsForm')) {
        this.getQuestionsFromLocal();
      } else {
        this.render.addClass(this.stepOne?.nativeElement, 'active');
      }
    }, 5);
  }
  advanceTo2() {
    this.firstAnswer
      ? (this.resultColor = '#25C03E')
      : (this.resultColor = '#FD0202');
    if (this.firstAnswer) {
      this.render.setAttribute(this.arrow1.nativeElement, 'fill', '#25C03E');
    } else {
      this.render.setAttribute(this.arrow1.nativeElement, 'fill', '#FD0202');
    }
    this.render.removeClass(this.stepOne?.nativeElement, 'active');
    this.render.addClass(this.stepOne?.nativeElement, 'done');
    this.render.addClass(this.stepTwo?.nativeElement, 'active');
    this.render.setAttribute(this.progress1?.nativeElement, 'value', '50');
    this.hideQ1 = true;
    this.showQ2Part1 = true;
  }

  advanceTo3(savedData?: boolean) {
    this.render.removeClass(this.stepTwo?.nativeElement, 'active');
    this.render.addClass(this.stepTwo?.nativeElement, 'done');
    this.render.addClass(this.stepThree?.nativeElement, 'active');
    this.render.setAttribute(this.progress1?.nativeElement, 'value', '100');
    this.hideQ2Part1 = true;
    this.hideQ2Part2 = true;
    savedData ? (this.showSpinner = false) : (this.showSpinner = true);

    setTimeout(() => {
      this.showSpinner = false;
      this.showConclusion = true;
    }, 1600);

    // get field description

    this.coreService
      .getFieldDesc(this.fieldName.toLowerCase())
      .subscribe((fd) => {
        this.fieldDesc = fd;
      });

    // get languages names

    this.coreService
      .getFieldLanguages(this.fieldName.toLowerCase())
      .subscribe((fl) => {
        if (this.fieldName.toLowerCase() === 'back-end') {
          this.fieldLanguages = [];
        } else {
          this.fieldLanguages = fl.split(' ');
        }
      });
    this.coreService.getBackendLangByRegion().subscribe((langsOfRegion) => {
      this.langsOfBackend = langsOfRegion;
    });
  }
  advanceTo2Part2() {
    this.hideQ2Part1 = true;
    this.showQ2Part2 = true;
    this.render.setAttribute(this.arrow2.nativeElement, 'fill', '#878787');
  }
  evaluateFieldChoice(savedData?: boolean) {
    if (this.fieldName !== 'none') {
      this.advanceTo3(savedData);
    } else {
      this.advanceTo2Part2();
    }
  }

  getBackendLangs() {
    this.dropDownTitle.nativeElement.innerHTML = this.selectedRegion;
    this.langsOfRegion = this.langsOfBackend[this.selectedRegion];
  }
  goToCourses() {
    this.passDataService.setFieldName(this.fieldName);
    this.passDataService.setFirstAnswer(this.firstAnswer);
    if (this.fieldName.toLowerCase() === 'back-end') {
      this.passDataService.setChoosenRegion(this.selectedRegion);
      this.passDataService.setLangsOfRegion(this.langsOfRegion);
    } else {
      this.passDataService.setFieldLangs(this.fieldLanguages);
    }

    this.router.navigate(['courses']);
    // this.saveQuestions();
  }
  resetQuestions() {
    localStorage.removeItem('questionsForm');
  }
  reload() {
    window.location.reload();
  }
  saveQuestions() {
    let questionsForm = new QuestionsForm(
      this.firstAnswer,
      this.fieldName,
      this.fieldDesc,
      this.fieldLanguages,
      !this.hideQ2Part2
    );
    localStorage.setItem('questionsForm', JSON.stringify(questionsForm));
  }
  getQuestionsFromLocal() {
    const loadedQuestionsData: {
      answerOne: boolean;
      fieldName: string;
      fieldDesc: string;
      fieldLangs: string[];
      isq2part2: boolean;
    } = JSON.parse(localStorage.getItem('questionsForm') || '{}');
    this.firstAnswer = loadedQuestionsData.answerOne;
    this.fieldName = loadedQuestionsData.fieldName;
    this.fieldDesc = loadedQuestionsData.fieldDesc;
    this.fieldLanguages = loadedQuestionsData.fieldLangs;
    this.hideQ1 = true;
    this.hideQ2Part1 = true;
    this.hideQ2Part2 = true;
    this.showConclusion = true;
    this.advanceTo2();
    this.evaluateFieldChoice(true);
  }
}
