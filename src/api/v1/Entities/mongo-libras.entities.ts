import { AbstractModel } from "../../../db/collection-model.entity";

export interface ISign {
  name: string;
  data: string;
  size: number;
  encoding: string;
  mimetype: string;
  md5: string;
}
export interface ILibrasTranslation {
	error?: boolean | string,
	from: string,
	to: any[],
	phrases: string[]
	translation: any[],
}

export class MongoSigns extends AbstractModel implements ISign  {
    name: string;
    data: string;
    size: number;
    encoding: string;
    mimetype: string;
    md5: string;
    
    constructor() {
      super();
      this.name = ""
      this.data = ""
      this.size = 0
      this.encoding = ""
      this.mimetype = ""
      this.md5 = ""
    }
  
};