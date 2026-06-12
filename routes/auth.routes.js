import { Router } from "express";

import { sigIn, signUp } from "../controllers/auth.controller.js";
import { validateFields } from "../middlewares/validate.middlewares.js";

const authRouter = Router();

// api/v1/auth/sign-in
authRouter.post('/sign-in', validateFields(['email', 'password']), sigIn);

// api/v1/auth/sign-up
authRouter.post('/sign-up', validateFields(['name', 'email', 'password']), signUp);

authRouter.post('/sign-out');

export default authRouter;