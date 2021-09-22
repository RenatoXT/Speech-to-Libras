import { google } from 'googleapis';
import Config from '../../../constants/constants';

const googleConfig = {
  clientId: Config.GoogleConfig.ClientId, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: Config.GoogleConfig.ClientSecret, // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: Config.GoogleConfig.ClientRedirect // this must match your google api settings
};

/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
export function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}