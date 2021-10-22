import axios from "axios";
import { Request, Response } from "express";
import LibrasTranslateDao from "../Data/mongo/libras-translate.dao";
const Sign = require("../Entities/mongo-libras.entities");

export class LibrasService {
  private static validateFile(file: any) {
    // Verifica o tipo do file e determina o filename de acordo com isso!
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) == -1) {
      return null;
    }

    if (!file.encoding) {
      return null;
    }

    if (!file.name) {
      return null;
    } else {
      // Tratamento para remover a extensão do arquivo  
        // Separa o último item após o ponto e dps junta tudo
      let dirtyName = file.name;
      let dirtyNameArr = dirtyName.split('.');
      dirtyNameArr.pop();

      file.name = dirtyNameArr.join(".");
    }

    if (!file.data) {
      return null;
    } else {
      // Altera o formato default do encoding para base64 ao invés de 7bit
      file.data = file.data.toString("base64");
    }

    if (!file.mimetype) {
      return null;
    } else {
      // Altera o formato default do encoding para base64 ao invés de 7bit
      file.encoding = "base64";
    }

    return file;
  }

  public static async textToLibras(text: string) {
    const librasValidTextUrl = "https://traducao2.vlibras.gov.br/translate";
    let response = {
      code: 404,
      message: "Libras Translate isn't working right now, try again later :')",
    };

    const rawResponse = await axios({
      method: "post",
      url: librasValidTextUrl,
      timeout: 20000, // 10 segundos timeout
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "true",
      },
      data: {
        text,
      },
    })
      .then((resp) => {
        response = {
          code: 200,
          message: resp.data as string,
        };
        return response;
      })
      .catch((error) => {
        //   console.error(error);
        response.code = 408;
      });

    return response;
  }

  public async uploadSign(req: Request, res: Response) {
    if (!req.files) {
      return res.status(406).send({
        code: 406,
        message: "You must send a file",
      });
    } else {
      const { sign } = req.files as any;

      const newSign = LibrasService.validateFile(sign);

      if (newSign !== null) {
        const dbResult = await LibrasTranslateDao.createSign(sign);

        if ((dbResult as any).error) {
          res.status(406).json(dbResult);
        } else {
          res.status(201).json(dbResult);
        }
      } else {
        return res.status(406).send({
          code: 406,
          message: "File must be an image",
        });
      }
    }

    return;
  }

  public async getSign(req: Request, resp: Response) {
    try {
      const result = await LibrasTranslateDao.getSign(req.params.name);
      console.log(result)
      resp.send(result);
    } catch (error) {
      resp.status(404).send({
        code: 404,
        message: "Sign not found",
        error: error,
      });
    }
  }

  public async deleteSign(req: Request, resp: Response) {
    try {
      const result = await LibrasTranslateDao.deleteSign(req.params.name);

      resp.send(result);
    } catch (error) {
      resp.status(404).send({
        code: 404,
        message: "Sign not deleted",
        error: error,
      });
    }
  }
}
