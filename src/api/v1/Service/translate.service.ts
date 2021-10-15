import { Request, Response } from "express";
const translate = require('translate-google');
const languages = require('translate-google');

interface ILanguageList {
    id: string,
    value: string
}

export class TranslateService {

    public async translateTo(req: Request, resp: Response) {
        let { from, to, text } = req.body;
        
        if ( !(from && to && text) ) {
            resp.status(401).json({ error: "Parâmetros Inválidos"})
        } else {
            from = from ? from.toString() : "" ;
            to = to ? to.toString() : "" ;
            text = text ? text.toString() : "" ;

            const result = await TranslateService.translateText(from, to, text);

            resp.status(result.code).json(result)
            
        }
    }

    private static async translateText(from: string, to: string, text: string) {
        if ( to !== "pt-libras" ) {
            translate( text, {from, to}).then((res: any) => {
                const response = {
                    code: 200,
                    message: {
                        from,
                        to,
                        text,
                        translated: res
                    }
                };

                return response;

                
            }).catch((err: any) => {
                return err;
            })
        }

        return {
            code: 406,
            message: "Not a valid language"
        };
    }

    public async validLangs(req: Request, resp: Response) {
        
        let langsTo : ILanguageList[] = [];
        const langsFrom : ILanguageList[] = [];
        const langClassKeys = Object.keys(languages.languages);

        langClassKeys.map( objKey => {
            if ( typeof languages.languages[objKey] === "string"){
                langsFrom.push({
                    id: objKey,
                    value: languages.languages[objKey]
                } as ILanguageList);
            }
        });

        langsTo = langsFrom;
        langsTo.push({
            id: "pt-libras",
            value: "Língua Brasileira de Sinais (Libras)"
        });

        const validLanguages = {
            from: langsFrom,
            to: langsTo
        };


        resp.status(200).json(validLanguages);
    }
}