import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  Renderer2,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  @Input() answerResult!: boolean;
  @Input() disableNextBtn: boolean = true;
  @Input() hideQuestion: boolean = false;
  @Input() showQuestion: boolean = false;
  @Input() showQuestionArrow: boolean = false;
  @Input() questionNumber!: number;
  @Output() question_finished = new EventEmitter<boolean>();
  @Output() field_choosen = new EventEmitter<string|boolean>();

  arrow1Color = '#14538E';
  arrow2Color = '#14538E';
  arrow3Color = '#14538E';

  // @ViewChild('arrow1') arrow1!: ElementRef;
  // @ViewChild('arrow2') arrow2!: ElementRef;
  // @ViewChild('arrow3') arrow3!: ElementRef;

  fields: string[] = [
    'Front-End',
    'Back-End',
    'Android',
    'iOS',
    'Cross-Platform',
    'none',
  ];
  fieldsDesc: string[] = [
    'Design user interface, color, screens and develop user side of website',
    'Developing databases and the code that handle database and process it and design business logic of your website',
    'Making apps for android users',
    'Making apps for iOS users',
    'Making apps that work on multiple platforms with one code rather than write code for each platform alone',
  ];

  fieldName: string = '';

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {} 

  advanceToNextQuestion() {
    if (this.answerResult) {
      this.arrow1Color = '#25C03E';
    } else {
      this.arrow1Color = '#FD0202';
    }
    this.hideQuestion = true;
    this.question_finished.emit(this.answerResult);
  }

  callEvaluateFieldChoice() {
    if (
      this.questionNumber === 2 &&
      this.fieldName !== 'none' &&
      this.fieldName.length !== 0
    ) {
      this.field_choosen.emit(this.fieldName);
    } else if (this.questionNumber === 2 && this.fieldName === 'none') {
      this.field_choosen.emit(this.fieldName);
    } else if (this.questionNumber === 2.1 && this.fieldName.length !== 0) {
      this.field_choosen.emit(this.fieldName);
    }
  }
 

 
}
