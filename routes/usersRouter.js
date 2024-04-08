import { Router } from "express";
import validateBody from "../middlewares/isValidBody.js";
import { authSchema, updateSchema } from "../schemas/usersSchems.js";
import * as controllers from "../controllers/authControllers.js";
import authenticate from "../middlewares/authenticate.js";
const usersRouter = Router();
import upload from "../middlewares/upload.js";

usersRouter.post("/register", validateBody(authSchema), controllers.register);
usersRouter.post("/login", validateBody(authSchema), controllers.login);
usersRouter.post("/logout", authenticate, controllers.logout);
usersRouter.get("/current", authenticate, controllers.current);
usersRouter.patch(
  "/",
  authenticate,
  validateBody(updateSchema),
  controllers.updateSubscription
);

usersRouter.patch(
  "/avatars",
  upload.single("avatar"),authenticate,
  controllers.updateAvatar
);

export default usersRouter;
