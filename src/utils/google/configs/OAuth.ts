import { google } from 'googleapis';
import Config from '../../../constants/constants';

const googleConfig = {
  clientId: Config.GoogleConfig.ClientId, 
  clientSecret: Config.GoogleConfig.ClientSecret, 
  redirect: Config.GoogleConfig.ClientRedirect
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