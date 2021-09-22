export interface IMongoUser {
  email: string;
  photoUrl: string;
  name: INames;
  gender: string;
  language: string;
  avatar: IAvatar
};

export interface IAvatar {
  code: number
};

export interface INames {
  displayName: string;
  familyName: string;
  givenName: string;
};

