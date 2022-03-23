import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LowerCasePipe } from '@angular/common';

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
  firstAnswer!: boolean;
  resultColor!: String;
  hideQ1: boolean = false;
  hideQ2: boolean = false;
  showQ2: boolean = false;
  fieldName: string = '';
  fieldDesc: string = '';
  showConclusion: boolean = false;
  lang1:string='';
  lang2:string='';
  lang3:string='';
  hideLang2Place:boolean=false;
  hideLang3Place:boolean=false;
  constructor(private render: Renderer2, private http: HttpClient) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.render.addClass(this.stepOne?.nativeElement, 'active');
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
    this.showQ2 = true;
  }
  advanceTo3() {
    this.render.removeClass(this.stepTwo?.nativeElement, 'active');
    this.render.addClass(this.stepTwo?.nativeElement, 'done');
    this.render.addClass(this.stepThree?.nativeElement, 'active');
    this.render.setAttribute(this.progress1?.nativeElement, 'value', '100');
    this.hideQ2 = true;
    this.showConclusion = true;
    // get field description
    this.http
      .get<{ [key: string]: string }>(
        'https://technoid-2022-default-rtdb.firebaseio.com/description.json'
      )
      .subscribe((data) => {
        this.fieldDesc = data[this.fieldName.toLowerCase()];
      });
      // get languages names
      if(this.fieldName.toLowerCase()==='front-end'){
        this.lang1='Html & css';
        this.lang2="JavaScript";
        this.hideLang3Place=true;
        
      }else if(this.fieldName.toLowerCase()==='cross-platform'){
        this.lang1='Dart';
        this.lang2="ReactNative";
        this.hideLang3Place=true;
      }
      else if(this.fieldName.toLowerCase()==='android'){
        this.lang1='Java';
        this.lang2="Kotlin";
        this.hideLang3Place=true;
      }
      else if(this.fieldName.toLowerCase()==='ios'){
        this.lang1='Swift';
        this.hideLang2Place=true
        this.hideLang3Place=true;
      }
     
  }
}
