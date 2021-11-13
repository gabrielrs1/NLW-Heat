import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";

import { Server } from "socket.io";

import { router } from "./routes";

const app = express();
app.use(cors());

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
    cors: {
        origin: "*"
    }
});

io.on("connection", socket => {
    console.log(`Connected socket ${socket.id}`);
});

app.use(express.json());
app.use(router);

// Github
app.get("/auth/github", (request, response) => {
    response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});

app.get("/github/callback", (request, response) => {
    const { code } = request.query;

    return response.json(code);
})

// Google
app.get("/auth/google", (request, response) => {
    response.redirect(
        `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.profile&access_type=offline&response_type=code&redirect_uri=http://localhost:3000&client_id=${process.env.GOOGLE_CLIENT_ID}`
    );
});

app.get("/google/callback", (request, response) => {
    const { code } = request.query;

    return response.json(code);
})


export { serverHttp, io }