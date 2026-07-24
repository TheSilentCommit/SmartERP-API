import mongoose from 'mongoose';

import { 
    getClientsController, 
    getClientController,
    createClientsController,
    updateClientController,
    deleteClientController
} from "../controllers/client.controllers.js";

import Client from '../models/client.models.js';
import Supplier from '../models/supplier.models.js';

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
    if(!Array.isArray(operations)){
        return {code: 400, message: 'Operations must be an array', success: false, data: []};
    }

    if(operations.length === 0){
        return {code: 400, message: 'Operations array cannot be empty', success: false, data: []};
    }

    const clients = [];

    const documents = operations.map(op => op.document);

    const duplicatedDocuments = documents.filter((doc, index) => documents.indexOf(doc) !== index);

    if(duplicatedDocuments.length > 0){
        return {code: 400, message: 'Duplicated documents faund in the request', success: false,
            data: [...new Set(duplicatedDocuments)]
        };
    }

    const existingClients = await Client.find({ document: { $in: documents } });

    if(existingClients.length > 0){
        return {code: 400, message: 'One or more clients are already registered', success: false, 
            data: existingClients.map(c => ({
                name: c.name,
                documet: c.document
            }))
        };
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        for(const operation of operations){
            const {
                name,
                document,
                documentType = 'CPF',
                email = null,
                phone = null,
                address: {
                    street = null,
                    number = null,
                    complement = null,
                    district = null,
                    city = null,
                    state = null,
                    zipCode = null,
                    country = null
                } = {}
            } = operation;

            clients.push({
                name,
                document,
                documentType,
                email,
                phone,
                address: {
                    street,
                    number,
                    complement,
                    district,
                    city,
                    state,
                    zipCode,
                    country
                },
                createdBy: userId,
                active: true
            });

        }

        const createdClients = await Client.insertMany(clients, { session });

        await session.commitTransaction();

        return {code: 201, message: 'Clients registered successfully', success: true, data: createdClients};

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const updateClientService = async (data, clientId, userId) => {
    const session = mongoose.startSession();

    try {
        session.startTransaction();

        const updateData = {};

        const allowedFields = [
            'name',
            'document',
            'documentType',
            'email',
            'phone'
        ];

        for(const field of allowedFields){
            if(data[field] !== undefined){
                updateData[field] = data[field];
            }
        }

        if(data.address) {
            for(const [key, value] of Object.entries(data.address)) {
                updateData[`address.${key}`] = value;
            }
        }

        updateData.updatedBy = userId;

        const client = await Client.findByIdAndUpdate(
            clientId,
            { $set: updateData },
            {
                returnDocument: 'after',
                runValidators: true,
                session
            }
        );

        if(!client){
            await session.abortTransaction();

            return {code: 404, message: 'Client not found', success: false, data: []};
        }

        await session.commitTransaction();

        return {code: 200, message: 'Client updated successfully', success: false, data: client};

    } catch (error) {
        await session.abortTransaction();

        error.message = `[updateClientService] ${error.message}`;
        throw error;
    } finally {
        session.endSession();
    }
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