import { Router } from "express";
import validateBody from "../middlewares/isValidBody.js";
import {
  authSchema,
  updateSchema,
  emailSchema,
} from "../schemas/usersSchems.js";
import controllers from "../controllers/authControllers.js";

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
  authenticate,
  upload.single("avatar"),
  controllers.updateAvatar
);
usersRouter.get("/verify/:verificationToken", controllers.verify);
usersRouter.post(
  "/verify",
  validateBody(emailSchema),
  controllers.resendVerify
);
export default usersRouter;
