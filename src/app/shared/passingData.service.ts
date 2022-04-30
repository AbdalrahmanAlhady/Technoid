import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PassingData {
  fieldName: string = '';
  fieldLangs!: string[];
  firstAnswer!: boolean; 
  choosenRegion:string ='';
  langsOfRegion: [{ [key: number]: string }] = [{}];
  constructor() {}

  setFieldName(name: string) {
    this.fieldName = name;
  }
  getFieldName(): string {
    return this.fieldName;
  }
  setFieldLangs(langs: string[]) {
    this.fieldLangs = langs;
  }
  getFieldLangs():string[]{
    return this.fieldLangs;
  }
  setFirstAnswer(answer: boolean) {
    this.firstAnswer =answer;
  }
  getFirstAnswer(): boolean {
    return this.firstAnswer;
  }
  setChoosenRegion(region:string) {
    this.choosenRegion =region;
  }
  getChoosenRegion(): string {
    return this.choosenRegion;
  }
  setLangsOfRegion(langsOfRegion:[{ [key: number]: string }]) {
    this.langsOfRegion =langsOfRegion;
  }
  getLangsOfRegion(): [{ [key: number]: string }] {
    return this.langsOfRegion;
  }
}
