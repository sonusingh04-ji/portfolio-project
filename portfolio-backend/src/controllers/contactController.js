import * as messageService from "../services/messageService.js";

const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validStatuses = [
    "UNREAD",
    "READ",
    "REPLIED"
];

export const createContactMessage = async (req, res) => {
    try {
        const {
            name,
            email,
            subject,
            message
        } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "name, email and message are required"
            });
        }

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        const result =
            await messageService.createMessage({
                name: name.trim(),
                email: email.trim(),
                subject: subject?.trim() || null,
                message: message.trim()
            });

        res.status(201).json({
            success: true,
            message: "Your message has been received",
            data: {
                id: result.savedMessage.id,
                emailSent: result.emailSent
            }
        });
    } catch (error) {
        console.error("Create Contact Message Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to submit contact message"
        });
    }
};

export const getAllMessages = async (req, res) => {
    try {
        const messages =
            await messageService.getAllMessages();

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error("Get Messages Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch messages"
        });
    }
};

export const updateMessageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message:
                    "status must be UNREAD, READ or REPLIED"
            });
        }

        const message =
            await messageService.updateMessageStatus(
                id,
                status
            );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Message status updated successfully",
            data: message
        });
    } catch (error) {
        console.error(
            "Update Message Status Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update message status"
        });
    }
};
export const getMessages = async (req, res) => {
    try {
        const messages =
            await messageService.getAllMessages();

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error(
            "Get Messages Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch messages"
        });
    }
};
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const message =
            await messageService.deleteMessage(id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });
    } catch (error) {
        console.error(
            "Delete Message Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to delete message"
        });
    }
};