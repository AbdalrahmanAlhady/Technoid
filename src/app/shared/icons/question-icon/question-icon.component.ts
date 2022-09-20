import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IconsBaseComponent } from '../icons-base/icons-base.component';

@Component({
  selector: 'app-question-icon',
  templateUrl: './question-icon.component.html',
  styleUrls: ['./question-icon.component.css']
})
export class QuestionIconComponent  extends IconsBaseComponent {
  constructor() { super(); }

}
