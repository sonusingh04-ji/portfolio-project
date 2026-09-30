import {
    createMedia as createMediaModel,
    getAllMedia as getAllMediaModel,
    deleteMedia as deleteMediaModel
} from "../models/mediaModel.js";

export const createMedia = async (data) => {
    return await createMediaModel(data);
};

export const getAllMedia = async () => {
    return await getAllMediaModel();
};

export const deleteMedia = async (id) => {
    return await deleteMediaModel(id);
};