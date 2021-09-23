export default class GoogleMetadata {

    /**
     * This scope tells google what information we want to request.
    */
     private static defaultScope = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/profile.language.read',
        'https://www.googleapis.com/auth/user.gender.read',
    ];
    
    public static PEOPLE = {
        resourceName: 'people/me',
        personFields: 'emailAddresses,names,genders,photos',
    };

    public static PERMISSION = {
        access_type: 'offline',
        prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
        scope: GoogleMetadata.defaultScope
    };

    
}