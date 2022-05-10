export interface QuestionsFormType {
  answerOne: boolean;
  fieldName: string;
  fieldDesc: string;
  fieldLangs?: string[];
  langsOfRegion?:[{ [key: number]: string }];
  isq2part2?: boolean;
  region?:string;
}

export class QuestionsForm {
  constructor(
    public answerOne: boolean,
    public fieldName: string,
    public fieldDesc: string,
    public fieldLangs?: string[],
    public langsOfRegion?:[{ [key: number]: string }],
    public isq2part2?: boolean,
    public region?:string
  ) {}

}
