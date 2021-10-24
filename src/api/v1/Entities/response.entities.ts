export interface IResp {
  code: number;
  data: any;
}

export interface ILanguageList {
  id: string;
  value: string;
}

export interface ITranslate {
  from: string,
  to: string,
  text: string,
  translated: any,
  libras?: any
}