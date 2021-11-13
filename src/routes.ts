import { Router } from "express";
import { AuthenticateGithubController } from "./controllers/AuthenticateGithubController";
import { AuthenticateGoogleController } from "./controllers/AuthenticateGoogleController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { Get3LastMessagesController } from "./controllers/Get3LastMessagesController";
import { ProfileUserController } from "./controllers/ProfileUserController";
import { ensureAuthenticated } from "./middleware/ensureAuthenticated";

const router = Router();

router.post("/authenticate/github", new AuthenticateGithubController().handle);
router.post("/authenticate/google", new AuthenticateGoogleController().handle);

router.post("/messages",
    ensureAuthenticated,
    new CreateMessageController()
    .handle
);

router.get("/messages/last3", new Get3LastMessagesController().handle);

router.get("/profile",
    ensureAuthenticated,
    new ProfileUserController()
    .handle
);

export { router }