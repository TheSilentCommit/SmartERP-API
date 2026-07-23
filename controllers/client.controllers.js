import { 
    getClientsService,
    getClientService,
    createClientsService,
    updateClientService,
    deleteClientService
} from "../services/client.services";
import { sendMessage } from "../utils/responses.utils";

export const getClientsController = async (req, res, next) => {
    try {
        const result = await getClientsService();

        return sendMessage(res, result.code, result.message, result.success, result.data);
    } catch (error) {
        next(error);
    }
};

export const getClientController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await getClientService(id);

        return sendMessage(res, result.code, result.message, result.success, result.data);
    } catch (error) {
        next(error);
    }
};

export const createClientsController = async (req, res, next) => {
    try {
        const { operation } = req.body;
        const userId = req.user.id;

        const result = await createClientsService(operation, userId);

        return sendMessage(res, result.code, result.message, result.success, result.data);
    } catch (error) {
        next(error);
    }
};

export const updateClientController = async (req, res, next) => {

};

export const deleteClientController = async (req, res, next) => {

};