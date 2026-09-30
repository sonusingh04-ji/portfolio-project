import {
    createMessage as createMessageModel,
    getAllMessages as getAllMessagesModel,
    updateMessageStatus as updateMessageStatusModel,
    deleteMessage as deleteMessageModel
} from "../models/messageModel.js";
import { sendContactNotification } from "./emailService.js";

export const createMessage = async (data) => {
    const savedMessage = await createMessageModel(data);

    let emailSent = false;
    let emailError = null;

    try {
        await sendContactNotification(data);
        emailSent = true;
    } catch (error) {
        console.error("Email Notification Error:", error.message);
        emailError = error.message;
    }

    return {
        savedMessage,
        emailSent,
        emailError
    };
};

export const getAllMessages = async () => {
    return await getAllMessagesModel();
};

export const updateMessageStatus = async (id, status) => {
    return await updateMessageStatusModel(id, status);
};
export const deleteMessage = async (id) => {
    return await deleteMessageModel(id);
};