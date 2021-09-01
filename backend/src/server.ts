import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import restaurants from './api/restaurants.route';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use("/api/v1/restaurants", restaurants);

app.use("*", (resp: Response, req: Request) => {
    resp.status(404).json({ error: "Rota não encontrada!"});
});

export default app;
