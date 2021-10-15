import { IAvatar, IMongoUser, INames } from "./mongo-user.interface";

export class MongoUser implements IMongoUser {
  email: string;
  photoUrl: string;
  name: INames;
  gender: string;
  language: string;
  origin: string;
  avatar: IAvatar;
  
  constructor() {
    this.email = ""
    this.photoUrl = ""
    this.gender = ""
    this.language = ""
    this.origin = ""
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
    this.email = params?.emailAddresses?.value || this.email;
    this.photoUrl = params?.photos?.url || this.photoUrl;
    this.gender = params?.genders?.value || this.gender;
    this.name = {
      displayName: params?.names?.displayName || this.name.displayName,
      familyName: params?.names?.familyName || this.name.familyName,
      givenName: params?.names?.givenName || this.name.givenName,
    };
    this.language = params?.language || this.language;
    this.avatar = params?.avatar || this.avatar;
    this.origin = "google"
  }

};

