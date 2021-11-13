import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
    id: string;
    name: string;
    user_oauth_id: string;
    avatar_url: string;
}

type AuthContextData = {
    githubUrl: string;
    googleUrl: string;
    user: User | null;
    signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
    children: ReactNode;
}

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        user_oauth_id: string;
    }
}

export function AuthProvider(props: AuthProvider) {
    const [user, setUser] = useState<User | null>(null);

    const githubUrl = "https://github.com/login/oauth/authorize?scope=user&client_id=914ee1431010fa7ea886";
    const googleUrl = "https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.profile&access_type=offline&response_type=code&redirect_uri=http://localhost:3000&client_id=953644508598-h6pvt36bieu0ahsa4qh72fqr5d68ouut.apps.googleusercontent.com";
    
    async function signIn(code: string, oauth: string|null) {
        const response = await api.post<AuthResponse>(
            oauth == "github"
            ? "authenticate/github"
            : "authenticate/google", {
            code: code
        });

        const { token, user } = response.data;
        
        localStorage.setItem("nlw:heat", token);
        
        api.defaults.headers.common.authorization = `Bearer ${token}`;
        
        setUser(user);
    }
    

    function signOut() {
        setUser(null);

        localStorage.removeItem("nlw:heat");
    }

    useEffect(() => {
        const token = localStorage.getItem("nlw:heat");

        if(token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`;

            api.get<User>("profile").then(response => {
                setUser(response.data);
            });
        }
    },[]);

    useEffect(() => {
        const url = window.location.href;

        // pega a url se possuir o parametro do code
        const hasGithubCode = url.includes("?code=");

        if(hasGithubCode) {
            // separa a url na rota principal e o codigo
            const [urlWithoutCode, githubCode1] = url.split("?code=");
            const [githubCode2,] = githubCode1.split("&");
            
            // apagar a antiga url e adiciona a padrao
            window.history.pushState({}, "", urlWithoutCode);
            
            const oauth = localStorage.getItem("type");

            signIn(githubCode2, oauth);

            localStorage.removeItem("type");
        }
    },[]);

    return (
        <AuthContext.Provider value={{ githubUrl, googleUrl, user, signOut }}>
            {props.children}
        </AuthContext.Provider>
    );
}