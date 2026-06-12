import { Router } from "express";

import { getUser, getUsers, putUser } from "../controllers/user.controllers.js";
import { signUp } from "../controllers/auth.controller.js";
import { validateFields } from "../middlewares/validate.middlewares.js";

const userRouter = Router();

// OK
// api/v1/users
userRouter.get('/', getUsers);

// OK
// api/v1/users/:id
userRouter.get('/:id', getUser);

// OK
// api/v1/users
userRouter.post('/', validateFields(['name', 'email', 'password']), signUp);

// api/v1/users/:id
userRouter.put('/:id', putUser);

// api/v1/users/:id
userRouter.delete('/:id', (req, res) => {});

export default userRouter;