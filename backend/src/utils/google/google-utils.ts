import { google } from "googleapis";
import { OAuth2Client } from "googleapis-common";
import { createConnection } from "./configs/OAuth";
import GoogleMetadata from "./configs/Metadata";
import { IUser } from "./entities/IUser";

/**
 * Create the google url to be sent to the client.
 */
export function generateSignInUrl(): string {
  const auth = createConnection();
  const url = auth.generateAuthUrl(GoogleMetadata.PERMISSION);
  return url;
}

/**
 * Extract the email and id of the google account from the "code" parameter.
 */
export async function getGoogleAccountFromCode(code: string) {
  try {
    const auth = createConnection();
    google.options({ auth });

    // get the auth "tokens" from the request
    const data = await auth.getToken(code);
    const tokens = data.tokens;

    // add the tokens to the google api so we have access to the account
    auth.setCredentials(tokens);

    // connect to google people api v1
    const people = google.people("v1");

    // get the required metadata from google people api
    const userResponse = await people.people.get(GoogleMetadata.PEOPLE);
    const userData = userResponse.data;

    const respUser = {
      names: userData.names?.pop(),
      photos: userData.photos?.pop(),
      genders: userData.genders?.pop(),
      emailAddresses: userData.emailAddresses?.pop(),
    } as IUser

    // return so we can login or sign up the user
    return {
      user: respUser,
      tokens: tokens, // you can save these to the user if you ever want to get their details without making them log in again
    };
  } catch (err) {
    // console.error(err);
    throw err;
  }

}