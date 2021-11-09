import axios from "axios";
import prismaClient from "../prisma";
import * as jwt from "jsonwebtoken";
import { encode } from "querystring";

interface IAccessTokenResponse {
    access_token: string;
}

interface IUserResponseGoogle {
    id: number;
    name: string;
    picture: string;
}

class GoogleUserAuthenticateService {
    async execute(code: string) {
        const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>("https://oauth2.googleapis.com/token", encode({
            code: decodeURIComponent(code),
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: "http://localhost:3000",
            grant_type: "authorization_code",
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        const response = await axios.get<IUserResponseGoogle>("https://www.googleapis.com/userinfo/v2/me", {
            headers: {
                Authorization: `Bearer ${accessTokenResponse.access_token}`
            }
        });

        const { id, name, picture } = response.data;

        let gUser = await prismaClient.google.findFirst({
            where: {
                google_id: String(id)
            }
        })

        if(!gUser) {
            gUser = await prismaClient.google.create({
                data: {
                    name,
                    google_id: String(id),
                    picture
                }
            })
        }

        const token = jwt.sign(
            {
                googleuser: {
                    id: gUser.id,
                    name: gUser.name,
                    picture: gUser.picture
                }
            },
            process.env.JWT_SECRET,
            {
                subject: gUser.id,
                expiresIn: "1d"
            }
        );

        return { token, gUser };
    }
}

export { GoogleUserAuthenticateService }