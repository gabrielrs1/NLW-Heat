import { Request, Response } from "express";
import { GithubUserAuthenticateService } from "../services/GithubUserAuthenticateService";

class AuthenticateGithubController {
    async handle(request: Request, response: Response) {
        const { code } = request.body;
        
        const service = new GithubUserAuthenticateService();

        try {
            const result = await service.execute(code);

            return response.json(result);
        } catch (error) {
            return response.json({ error: error.message });
        }

    }
}

export { AuthenticateGithubController }