import { Router } from "express";

import { authorizeGeneral } from "../middlewares/auth.middlewares";

const clientRouter = Router();

clientRouter.get('/');

clientRouter.get('/:id');

clientRouter.post('/');

clientRouter.put('/:id');

clientRouter.delete('/id');

export default clientRouter;