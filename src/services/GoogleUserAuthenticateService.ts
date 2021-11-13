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
        const url = "https://oauth2.googleapis.com/token";

        const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, encode({
            code: decodeURIComponent(code),
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: "http://localhost:3000",
            grant_type: "authorization_code"
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

        let user = await prismaClient.user.findFirst({
            where: {
                user_oauth_id: String(id)
            }
        })

        if(!user) {
            user = await prismaClient.user.create({
                data: {
                    name,
                    user_oauth_id: String(id),
                    avatar_url: picture
                }
            })
        }

        const token = jwt.sign(
            {
                googleUser: {
                    id: user.id,
                    name: user.name,
                    picture: user.avatar_url
                }
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: "1d"
            }
        );

        return { token, user };
    }
}

export { GoogleUserAuthenticateService }