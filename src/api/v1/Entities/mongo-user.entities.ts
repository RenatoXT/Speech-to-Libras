import { AbstractModel } from "../../../db/collection-model.entity";

export interface IMongoUser {
  email: string;
  photoUrl: string;
  name: INames;
  gender: string;
  language: string;
  avatar: IAvatar;
  origin: string
};

export interface IAvatar {
  code: number
};

export interface INames {
  displayName: string;
  familyName: string;
  givenName: string;
};

export class MongoUser extends AbstractModel implements IMongoUser  {
  email: string;
  photoUrl: string;
  name: INames;
  gender: string;
  language: string;
  origin: string;
  avatar: IAvatar;
  
  constructor() {
    super();
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

