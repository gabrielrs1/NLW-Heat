import { Request, Response } from "express";
import { GoogleUserAuthenticateService } from "../services/GoogleUserAuthenticateService";

class AuthenticateUserController {
    async handle(request: Request, response: Response) {
        const { code } = request.body;
        
        const service = new GoogleUserAuthenticateService();

        try {
            const result = await service.execute(code);

            return response.json(result);
        } catch (error) {
            console.log("erro", error)
            return response.json({ error: error });
        }

    }
}

export { AuthenticateUserController }