import { Request, Response } from "express";

import UsersDao from "../Data/mongo/users.dao";

export class UserService {
    // TODO Liberar as funções de acordo com o token do usuário!

    public async getUser(req: Request, resp: Response) {
        const { email } = req.params;

        if ( email ) {
            const usersDB = new UsersDao()
            const user = await usersDB.searchUser(email.toString());

            resp.status(200).json(user);
        } else {
            resp.status(401).json({ 
                error: "Usuário não cadastrado",
            });
        }
        
    };

    public updateUser = async (req: Request, resp: Response) => {
        const { user } = req.body;

        if ( user ) {
            const usersDB = new UsersDao()
            const updatedUser = await usersDB.updateUser(user);

            resp.json(updatedUser);
        } else {
            resp.status(401).json({ 
                error: "Usuário não cadastrado",
            });
        }
        
    };

    public deleteUser = async (req: Request, resp: Response) => {
        const { email } = req.params;

        if ( email ) {
            const usersDB = new UsersDao()
            const user = await usersDB.deleteUser(email.toString());

            resp.status(200).json(user);
        } else {
            resp.status(401).json({ 
                error: "Usuário não cadastrado",
            });
        }
        
    };
}