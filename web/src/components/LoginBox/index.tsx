import styles from "./styles.module.scss";
import { VscGithubInverted } from "react-icons/vsc";
import { SiGoogle } from "react-icons/si";
import { useContext } from "react";
import { AuthContext } from "../../context/auth";

export function LoginBox() {
    const { googleUrl, githubUrl } = useContext(AuthContext);

    function hancleChangeType(param: string) {
        localStorage.setItem("type", param);
    }

    return (
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sua mensagem</strong>
            <a onClick={() => hancleChangeType("github")} href={githubUrl} className={styles.signInWithGithub}>
                <VscGithubInverted size="24" />
                Entrar com github
            </a>
            <a onClick={() => hancleChangeType("google")} href={googleUrl} className={styles.signInWithGithub}>
                <SiGoogle size="24" />
                Entrar com google
            </a>
        </div>
    );
}