import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

interface IPayload {
    sub: string;
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization;

    if(!authToken) {
        return response.status(401).json({
            errorCode: "token.invalid"
        });
    }

    // Separa o Bearer do token, e dai ele retorna um array dividindo
    // o ["Bearer", "wadawndwj5235jiw"], ai essa virgula faz com que ele
    // elimine a primeira posição
    const [,token] = authToken.split(" ");

    try {
        // Recebe o parametro sub do verify
        const { sub } = jwt.verify(token, process.env.JWT_SECRET) as IPayload;

        // Adiciona ao request do express o user_id para poder receber em outros lugares
        request.user_id = sub;
        
        return next();
    } catch (error) {
        return response.status(401).json({ errorCode: "token.expired" });
    }
}