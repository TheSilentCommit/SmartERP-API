import { Router } from "express";

import { authorizeGeneral } from "../middlewares/auth.middlewares";
import {
    getClientsController,
    getClientController,
    createClientsController,
    updateClientController,
    deleteClientController
} from '../controllers/client.controllers.js';

import { authorizeGeneral } from '../middlewares/auth.middlewares.js'

const clientRouter = Router();

clientRouter.get('/', getClientsController);

clientRouter.get('/:id', getClientController);

clientRouter.post('/', createClientsController);

clientRouter.put('/:id', updateClientController);

clientRouter.delete('/id', deleteClientController);

export default clientRouter;