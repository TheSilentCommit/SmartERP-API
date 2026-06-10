import { Router } from "express";

import { getUser, getUsers } from "../controllers/user.controllers.js";
import { signUp } from "../controllers/auth.controller.js";
import { validateFields } from "../middleware/validate.middleware.js";

const userRouter = Router();

// OK
// api/v1/users
userRouter.get('/', getUsers);

// OK
// api/v1/users/:id
userRouter.get('/:id', getUser);

// OK
// api/v1/users
userRouter.post('/', validateFields(['name', 'email', 'password', 'admin']), signUp);

// api/v1/users/:id
userRouter.put('/:id', (req, res) => {});

// api/v1/users/:id
userRouter.delete('/:id', (req, res) => {});

export default userRouter;