export abstract class AbstractModel {
    constructor() {
    }
  
    public assignValues(params: any) {
      const listKeys = Object.keys(this);
  
      listKeys.map( paramKey => {
        if (params[paramKey] !== undefined) {
          (this as any)[paramKey] = params[paramKey];
        }
      });
    }
}