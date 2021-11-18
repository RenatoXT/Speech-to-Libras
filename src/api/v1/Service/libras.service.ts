import axios from "axios";
import { Request, Response } from "express";

import LibrasTranslateDao from "../Data/mongo/libras-translate.dao";

import { IResp } from './../Entities/response.entities';
import { ILibrasTranslation, ISign } from "./../Entities/mongo-libras.entities";

// TODO Criar ENUM com os códigos de retorno

export class LibrasService {
  
  public static async textToLibras(text: string) {
    const librasValidTextUrl = "https://traducao2.vlibras.gov.br/translate";
    let response: IResp = {
      code: 404,
      data: "Libras Translate isn't working right now, try again later :')",
    };

    const rawResponse = await axios({
      method: "post",
      url: librasValidTextUrl,
      timeout: 20000, // 20 segundos timeout
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "true",
      },
      data: {
        text,
      },
    })
      .then(async (resp) => {
        
				if ( resp.data == undefined || resp.data == null || !resp.data ){
					throw "VLibras indisponível"
				}

        const librasResult: ILibrasTranslation = await this.librasTranslate(resp.data as string);

				response.code = librasResult.error ? 406 : 200;
				response.data = librasResult;

        return response;
      })
      .catch((error) => {
        console.error(error);
        response.code = 408;
      });

    return response;
  }

  public async uploadSign(req: Request, res: Response) {
		let response: IResp = {
      code: 406,
      data: "You must send a image file",
    };

    if (req.files) {
      const { sign } = req.files as any;

      const newSign = LibrasService.validateFile(sign);

      if (newSign !== null) {
        response.data = await LibrasTranslateDao.createSign(sign);

        if (!response.data.error) {
					response.code = 201;
        } else {
          throw response.data;
        }

        return res.status(response.code).send(response);
      } 
    }

    return res.status(response.code).send(response);
  }

  public async updateSign(req: Request, resp: Response) {
		let response: IResp = {
      code: 406,
      data: "You must send a image file",
    };
    try {
      if (req.files) {
        const { sign } = req.files as any;
  
        const newSign = LibrasService.validateFile(sign);
  
        if (newSign !== null) {
          const updateResp: any = await LibrasTranslateDao.updateSign(sign);
          
          if (updateResp.error == undefined) {
            response.code = 201;
            response.data = updateResp;
          } else {
            throw updateResp.error;
          }
        } 
      }
  
    } catch (error) {
			response.code = 404;
			response.data = { error };
    }

    return resp.status(response.code).send(response);
  }

  public async getSign(req: Request, resp: Response) {
		const response: IResp = {
      code: 404,
      data: { error: "Sign not found" },
    }

    try {
      const dbResp: any = await LibrasTranslateDao.getSign(req.params.name);
      
			if ( dbResp == null || dbResp.error !== undefined){
				response.data = response.data.error
				throw response.data;
			} else {
        response.data = dbResp;
      }

			response.code = 200;
      resp.status(response.code).send(response.data);
    } catch (error) {
      response.code = 404;
			response.data = { error };

      resp.status(response.code).send(response.data);
    }
  }

  public async deleteSign(req: Request, resp: Response) {
		const response: IResp = {
      code: 404,
      data: { error: "Sign not deleted" },
    }
    try {
      const dbResp: any = await LibrasTranslateDao.deleteSign(req.params.name);

      if ( dbResp == null || dbResp.error !== undefined){
				response.data = response.data.error
				throw response.data;
			} else {
        response.data = dbResp;
      }

			response.code = 202;
      resp.status(response.code).send(response.data);
    } catch (error) {
			response.code = 404;
			response.data = { error };

      resp.status(response.code).send(response.data);
    }
  }

	
  private static async librasTranslate(transpiled: string): Promise<ILibrasTranslation> {
    const translation: ILibrasTranslation = {
      error: undefined,
      from: transpiled.toLowerCase(),
      to: [] as any[],
      phrases: transpiled.toUpperCase().trim().replace(" ", " [ESPACO] ").split(" "),
      translation: [] as any,
    };

    const order: string[] = [];

    // Realiza a interação entre todas as frases
    // Utiliza o promise all para esperar o retorno de todas as requests
    translation.translation = await Promise.all(
      translation.phrases.map(async (phrase: string) => {
        if (translation.error == undefined) {
          let translationResult: ISign[] = [];

          const searchPhrase = await LibrasTranslateDao.searchSign(phrase);

          // Se a frase existe na database, utilize este valor para a tradução
          // caso contrário, quebre a frase em chars e busque-os
          if (searchPhrase !== null) {
            order.push(phrase);
            translationResult.push(searchPhrase as ISign);
          } else {
            const phraseChars = Array.from(phrase);

            // Realiza a interação entre todos os chars
            // Utiliza o promise all para esperar o retorno de todas as requests
            await Promise.all(
              phraseChars.map(async (char: string) => {
                if (translation.error == undefined) {
                  order.push(char);
                  const searchChar = await LibrasTranslateDao.searchSign(char);

                  if (searchChar === null) {
                    translation.error = `Não foi possível traduzir, solicite a tradução da palavra: ${phrase}`;
                  } else {
                    translationResult.push(searchChar as ISign);
                  }
                }
              })
            );
          }

          translationResult = this.orderQueue(order, translationResult);
          return translationResult;
        }

        return null;
      })
    );

    // Dá um flat para ter todas as traduções em um único array
    translation.to = translation.error == undefined ? translation.translation.flat(1) : [];
    return translation;
  }

  // TODO melhorar a tratativa! 
  private static orderQueue( order: string[], translation: ISign[]) {
    const orderedQueue: ISign[] = [];

    order.map( ( ordIndex ) => {
        const transIndex = translation.findIndex((element, index) => {
            return element.name === ordIndex
        });
        
        orderedQueue.push(translation.splice(transIndex, 1)[0]);
        
    });

    return orderedQueue;
  }

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
      let dirtyName = file.name.toUpperCase();
      let dirtyNameArr = dirtyName.split(".");
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
}
