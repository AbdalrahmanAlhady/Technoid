import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-loader-spinner',
  templateUrl: './loader-spinner.component.html',
  styleUrls: ['./loader-spinner.component.css'],
})
export class LoaderSpinnerComponent implements OnInit {
  @ViewChild('loader') loader!: ElementRef;
  @Input() centerIt: number = 0;
  constructor(private render:Renderer2) {}

  ngOnInit(): void {
   
    setTimeout(() => {
      if (this.centerIt === 1) {
        this.render.addClass(this.loader.nativeElement, 'center');
      }
    }, 100);
    
  }
}
