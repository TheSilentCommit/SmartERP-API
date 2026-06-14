import { Router } from "express";

import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controllers.js";
import { authorizeAdminOrOwner, authorizeGeneral } from "../middlewares/auth.middlewares.js";

const userRouter = Router();

// api/v1/users
userRouter.get('/', authorizeGeneral, getUsers);

// api/v1/users/:id
userRouter.get('/:id', authorizeGeneral, getUser);

// api/v1/users/:id
userRouter.put('/:id', authorizeGeneral, authorizeAdminOrOwner, updateUser);

// api/v1/users/:id
userRouter.delete('/:id', authorizeGeneral, authorizeAdminOrOwner, deleteUser);

export default userRouter;