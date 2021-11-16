import { ITranslate } from './../Entities/response.entities';
import { Request, Response } from "express";
import { LibrasService } from "./libras.service";

import { ILanguageList, IResp } from "../Entities/response.entities"

const translate = require("translate-google");
const languages = require("translate-google");

export class TranslateService {
  public async translateTo(req: Request, resp: Response) {
    let { from, to, text } = req.body;
    let response: IResp = {
      code: 401,
      data: { error: "Sign not found" },
    }

    if (!(from && to && text)) {
      resp.status(401).json({ error: "Parâmetros Inválidos" });
    } else {
      from = from ? from.toString().toLowerCase() : "";
      to = to ? to.toString().toLowerCase() : "";
      text = text ? text.toString() : "";

      response = await TranslateService.translateText(from, to, text);

      resp.status(response.code).json(response.data);
    }
  }

  private static async translateText(from: string, to: string, text: string) {
    let response: IResp = {
      code: 200,
      data: {
        from,
        to,
        text,
        translated: "",
      } as ITranslate,
    }

    if (to !== "pt-libras") {

      response.data.translated = await translate(text, { from, to })
        .catch((err: any) => {
          return err;
        });
    } else if (to === "pt-libras" && from === "pt") {
      const responseLibras = await LibrasService.textToLibras(text);

      response.code = responseLibras.code;

      if (responseLibras.code === 200) {
        response.data.translated = responseLibras.data.to;
        response.data.libras = true; //responseLibras.data
      } else {
        response.data = responseLibras.data;
      }
    } else {
      response.code = 406,
      response.data = { error: "Não é possível traduzir este idioma ainda :("}
    }

    return response;
  }

  public async validLangs(req: Request, resp: Response) {
    let response: IResp = {
      code: 200,
      data: {},
    }

    let langsTo: ILanguageList[] = [];
    const langsFrom: ILanguageList[] = [];
    const langClassKeys = Object.keys(languages.languages);

    langClassKeys.map((objKey) => {
      if (typeof languages.languages[objKey] === "string") {
        langsFrom.push({
          id: objKey,
          value: languages.languages[objKey],
        } as ILanguageList);
      }
    });

    langsTo = langsFrom;
    langsTo.push({
      id: "pt-libras",
      value: "Língua Brasileira de Sinais (Libras)",
    });

    response.data = {
      from: langsFrom,
      to: langsTo,
    };

    resp.status(response.code).json(response.data);
  }
}
