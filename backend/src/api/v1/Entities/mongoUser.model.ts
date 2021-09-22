import { IAvatar, IMongoUser, INames } from "./IMongoUser";

export class MongoUser implements IMongoUser {
  email: string;
  photoUrl: string;
  name: INames;
  gender: string;
  language: string;
  avatar: IAvatar;
  
  constructor() {
    this.email = ""
    this.photoUrl = ""
    this.gender = ""
    this.language = ""
    this.name = {
      displayName: "",
      familyName: "",
      givenName: "",
    }
    this.avatar = {
      code: 0
    }
  }

  public assignValues(params: any) {
    const listKeys = Object.keys(this);

    listKeys.map( paramKey => {
      if (params[paramKey] !== undefined) {
        (this as any)[paramKey] = params[paramKey];
      }
    });
  }

  public assignGoogleResultValues(params: any) {
    this.email = params.emailAddresses.value;
    this.photoUrl = params.photos.url;
    this.gender = params.genders.value;
    this.name = {
      displayName: params.names.displayName,
      familyName: params.names.familyName,
      givenName: params.names.givenName,
    };
    this.language = params.language || this.language;
    this.avatar = params.avatar || this.avatar;
  }

};

