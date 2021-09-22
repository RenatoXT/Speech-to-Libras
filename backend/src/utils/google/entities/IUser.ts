export interface IUser {
  names: undefined | {
    metadata: Object,
    displayName: string,
    familyName: string,
    givenName: string,
    displayNameLastFirst: string,
    unstructuredName: string,
  },
  photos: undefined | {
    metadata: Object,
    url: string,
  },
  genders: undefined | {
    metadata: Object,
    value: string,
    formattedValue: string,
  },
  emailAddresses: undefined | {
    metadata: Object,
    value: string,
  },
}
