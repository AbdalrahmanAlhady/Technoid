import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { User } from '../auth/User.model';
import { QuestionsForm, QuestionsFormType } from '../core/QuestionsForm.model';

@Injectable({
  providedIn: 'root',
})
export class PassingData {
  fieldName: string = '';
  fieldDesc: string = '';
  fieldLangs!: string[];
  firstAnswer!: boolean;
  choosenRegion: string = '';
  langsOfRegion: [{ [key: number]: string }] = [{}];
  isQ2Part2Used: boolean = false;
  userData!: User ;
  userID!: string ;
  constructor(private http: HttpClient) {
  }

  setFieldName(name: string) {
    this.fieldName = name;
  }
  getFieldName(): string {
    return this.fieldName;
  }
  setFieldDesc(desc: string) {
    this.fieldDesc = desc;
  }
  getFieldDesc(): string {
    return this.fieldDesc;
  }
  setFieldLangs(langs: string[]) {
    this.fieldLangs = langs;
  }
  getFieldLangs(): string[] {
    return this.fieldLangs;
  }
  setFirstAnswer(answer: boolean) {
    this.firstAnswer = answer;
  }
  getFirstAnswer(): boolean {
    return this.firstAnswer;
  }
  setChoosenRegion(region: string) {
    this.choosenRegion = region;
  }
  getChoosenRegion(): string {
    return this.choosenRegion;
  }
  setLangsOfRegion(langsOfRegion: [{ [key: number]: string }]) {
    this.langsOfRegion = langsOfRegion;
  }
  getLangsOfRegion(): [{ [key: number]: string }] {
    return this.langsOfRegion;
  }

  setIsQ2Part2Used(value: boolean) {
    this.isQ2Part2Used = value;
  }
  getIsQ2Part2Used(): boolean {
    return this.isQ2Part2Used;
  }

  saveQuestions() {
    this.userData= JSON.parse(localStorage.getItem('userData') || '{}')
    this.userID = JSON.parse(localStorage.getItem('userData') || '{}').id;
     
    const questionsForm = new QuestionsForm(
      this.firstAnswer,
      this.fieldName,
      this.fieldDesc,
      this.fieldLangs,
      this.langsOfRegion,
      this.isQ2Part2Used,
      this.choosenRegion
    );

    this.http
      .put<QuestionsForm>(
        'https://technoid-2022-default-rtdb.firebaseio.com/questionsData/' +
          this.userID +
          '.json',
        questionsForm
      )
      .subscribe({
        next: (response) => {

        },
        error: (error) => {

        },
      });
  }
  getQuestionData(userId: string) {

    return this.http
      .get<QuestionsFormType>(
        'https://technoid-2022-default-rtdb.firebaseio.com/questionsData.json'
      )
      .pipe(
        map((questionsData) => {
          return questionsData[userId];
        })
      );
  }
  checkIfDataSaved(userId: string) {
    return this.http
      .get<QuestionsFormType>(
        'https://technoid-2022-default-rtdb.firebaseio.com/questionsData.json'
      )
      .pipe(
        map((questionsData) => {
          return !!questionsData[userId];
        })
      );
  }
  deleteQuestionData(userId: string) {
    return this.http.delete(
      'https://technoid-2022-default-rtdb.firebaseio.com/questionsData/' +
        userId +
        '.json'
    );
  }
}
