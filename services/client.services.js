import mongoose from 'mongoose';

import { 
    getClientsController, 
    getClientController,
    createClientsController,
    updateClientController,
    deleteClientController
} from "../controllers/client.controllers.js";

import Client from '../models/client.models.js';

export const getClientsService = async () => {
    try {
        const clients = await Client.find().sort({ name: 1 });

        return {code: 200, message: 'Clients', success: true, data: clients};
    } catch (error) {
        throw error;
    }
};

export const getClientService = async (clientId) => {
    try {
        const client = await Client.findById(clientId);

        if(!client){
            return {code: 404, message: 'Client not found', success: false, data: []};
        }

        return {code: 200, message: 'Client', success: true, data: client};
    } catch (error) {
        throw error;
    }
};

export const createClientsService = async (operations, userId) => {
    
};

export const updateClientService = async () => {

};

export const deleteClientService = async (clientId, userId) => {
    try {
        const client = await Client.findByIdAndUpdate(
            clientId,
            {
                active: false,
                updatedBy: userId
            },
            { returnDocument: 'after' }
        ).populate('updatedBy', 'name');

        if(!client){
            return {code: 404, message: 'Client not found', success: false, data: []};
        }

        return {code: 200, message: 'Client deleted successfully', success: true, data: client};
    } catch (error) {
        throw error;
    }
};