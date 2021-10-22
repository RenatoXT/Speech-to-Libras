import { Request, Response } from "express";
import { LibrasService } from "./libras.service";

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

        let resp: any = {
            code: 200,
            message: {
                from,
                to,
                text,
                translated: ""
            }
        };

        if ( to !== "pt-libras" ) {
            translate( text, {from, to}).then((res: any) => {

                resp.message.translated = res;

                
                return resp;
            }).catch((err: any) => {
                return err;
            })
        } else if (to === "pt-libras"){
            const responseLibras = await LibrasService.textToLibras(text);

            if ( responseLibras.code === 200 ) {
                resp.message.translated = responseLibras.message;
            }

            return resp
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