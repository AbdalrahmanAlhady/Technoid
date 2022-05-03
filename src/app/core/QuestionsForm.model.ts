export class QuestionsForm {
  constructor(
    public answerOne: boolean,
    public fieldName: string,
    public fieldDesc: string,
    public fieldLangs: string[],
    public isq2part2:boolean,
    
  ) {}

  setQuestionForm(
    answerOne: boolean,
    fieldName: string,
    fieldDesc: string,
    fieldLangs: string[],
    isq2part2:boolean,
  ) {
    this.answerOne = answerOne;
    this.fieldName = fieldName;
    this.fieldDesc = fieldDesc;
    this.fieldLangs = fieldLangs;
    this.isq2part2 = isq2part2;

  }
}
