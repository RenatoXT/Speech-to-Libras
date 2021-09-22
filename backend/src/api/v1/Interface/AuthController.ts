import { Request, Response } from "express";
import { AbstractRouteController } from "../../../routes/AbstractRouteController";

import { generateSignInUrl, getGoogleAccountFromCode } from "../../../utils/google/google-utils";

export class AuthController extends AbstractRouteController {
    constructor() {
        super();
        this.path += "/Auth";
        this.InitializeController();
    }

    public async InitializeController() {
        await this.InitializeGetGoogle();
        await this.InitializeResultGoogle();
    }

    public async InitializeGetGoogle() {
        this.router.get(this.path, this.googleAuth).bind(this);
    }

    public async InitializeResultGoogle() {
        this.router.get(this.path + "/GoogleAuth", this.googleAuthResult).bind(this);
    }

    /**
     * Generate a sign-in url for google access
     */
    private googleAuth = (req: Request, resp: Response) => {
        const url = generateSignInUrl();

        resp.status(201).json({ 
            error: "Usuário não logado, necessário fazer login para acessar",
            url
        });
    }

    /**
     * gets the google sign-in result and get the user data from google api's
     */
    private googleAuthResult = async (req: Request, resp: Response) => {
        let { code } = req.query;
        
        if ( !code ) {
            resp.status(401).json({ error: "User not authenticated "})
        } else {
            code = code ? code.toString() : "" ;
            
            getGoogleAccountFromCode(code).then((result) => {
                if ( result ) {
                    const userInfo = result;
                    const userData = userInfo.user;

                    // TODO Salvar os dados do usuário no bd (userData)
                    // TODO Fazer a gestão de acesso através do token
                    
                    resp.status(201).json({ 
                        msg: `IH ALA, A WILD ${userData.names?.givenName} APPEARED`
                    });
                } else {
                    throw("User not authenticated");
                }
            });
        }
    }
}