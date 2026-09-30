import { useEffect, useState } from "react";
import {
    Inbox,
    Eye,
    Trash2,
    X,
    Mail,
    CalendarDays
} from "lucide-react";

import api from "../services/api";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadMessages = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/contact/messages")

            setMessages(response.data.data || []);
        } catch (err) {
            console.error("Load messages error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load messages"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            setError("");
            setSuccess("");

            const response = await api.put(
                `/api/contact/messages/${id}/status`,
                {
                    status
                }
            );

            const updatedMessage = response.data.data;

            setMessages((previous) =>
                previous.map((message) =>
                    message.id === id
                        ? updatedMessage
                        : message
                )
            );

            if (selectedMessage?.id === id) {
                setSelectedMessage(updatedMessage);
            }

            setSuccess(
                `Message status changed to ${status}.`
            );
        } catch (err) {
            console.error(
                "Update message status error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update message status"
            );
        }
    };

    const handleDelete = async (message) => {
        const confirmed = window.confirm(
            `Delete the message from "${message.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/api/contact/messages/${message.id}`
            );

            if (
                selectedMessage?.id === message.id
            ) {
                setSelectedMessage(null);
            }

            setSuccess(
                "Message deleted successfully."
            );

            await loadMessages();
        } catch (err) {
            console.error(
                "Delete message error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete message"
            );
        }
    };

    const openMessage = async (message) => {
        setSelectedMessage(message);

        if (message.status === "UNREAD") {
            await updateStatus(
                message.id,
                "READ"
            );
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "UNREAD":
                return "bg-red-100 text-red-700";

            case "READ":
                return "bg-blue-100 text-blue-700";

            case "REPLIED":
                return "bg-green-100 text-green-700";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    const unreadCount = messages.filter(
        (message) =>
            message.status === "UNREAD"
    ).length;

    const readCount = messages.filter(
        (message) =>
            message.status === "READ"
    ).length;

    const repliedCount = messages.filter(
        (message) =>
            message.status === "REPLIED"
    ).length;

    return (
        <div className="p-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-slate-900 p-3 text-white">
                            <Inbox size={22} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Messages
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage messages received from your portfolio contact form.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">

                        <div className="rounded-xl bg-red-50 px-4 py-3">
                            <p className="text-xs text-red-500">
                                Unread
                            </p>

                            <p className="mt-1 text-xl font-bold text-red-700">
                                {unreadCount}
                            </p>
                        </div>

                        <div className="rounded-xl bg-blue-50 px-4 py-3">
                            <p className="text-xs text-blue-500">
                                Read
                            </p>

                            <p className="mt-1 text-xl font-bold text-blue-700">
                                {readCount}
                            </p>
                        </div>

                        <div className="rounded-xl bg-green-50 px-4 py-3">
                            <p className="text-xs text-green-500">
                                Replied
                            </p>

                            <p className="mt-1 text-xl font-bold text-green-700">
                                {repliedCount}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Alerts */}
                {success && (
                    <div className="mt-6 rounded-xl bg-green-50 px-5 py-4 text-sm text-green-700">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mt-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Messages */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Inbox
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {messages.length} message
                            {messages.length === 1
                                ? ""
                                : "s"} available.
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-slate-500">
                            Loading messages...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="p-12 text-center">

                            <Inbox
                                size={42}
                                className="mx-auto text-slate-300"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                No messages
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Your portfolio contact inbox is empty.
                            </p>

                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200">

                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`p-6 transition hover:bg-slate-50 ${
                                        message.status ===
                                        "UNREAD"
                                            ? "bg-slate-50/70"
                                            : ""
                                    }`}
                                >
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                                        <div className="min-w-0 flex-1">

                                            <div className="flex flex-wrap items-center gap-3">

                                                {message.status ===
                                                    "UNREAD" && (
                                                        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                                                    )}

                                                <h3 className="font-semibold text-slate-900">
                                                    {message.name}
                                                </h3>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                        message.status
                                                    )}`}
                                                >
                                                    {
                                                        message.status
                                                    }
                                                </span>

                                            </div>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {
                                                    message.email
                                                }
                                            </p>

                                            <h4 className="mt-4 text-base font-semibold text-slate-800">
                                                {
                                                    message.subject
                                                }
                                            </h4>

                                            <p className="mt-2 max-w-4xl truncate text-sm text-slate-600">
                                                {
                                                    message.message
                                                }
                                            </p>

                                            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">

                                                <span className="flex items-center gap-1.5">
                                                    <CalendarDays
                                                        size={14}
                                                    />

                                                    {formatDate(
                                                        message.created_at
                                                    )}
                                                </span>

                                                <span className="flex items-center gap-1.5">
                                                    <Mail
                                                        size={14}
                                                    />

                                                    Contact Form
                                                </span>

                                            </div>

                                        </div>

                                        <div className="flex flex-wrap gap-2">

                                            <button
                                                onClick={() =>
                                                    openMessage(
                                                        message
                                                    )
                                                }
                                                className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                            >
                                                <Eye size={16} />
                                                View
                                            </button>

                                            {message.status !==
                                                "UNREAD" && (
                                                    <button
                                                        onClick={() =>
                                                            updateStatus(
                                                                message.id,
                                                                "UNREAD"
                                                            )
                                                        }
                                                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                                    >
                                                        Unread
                                                    </button>
                                                )}

                                            {message.status !==
                                                "READ" && (
                                                    <button
                                                        onClick={() =>
                                                            updateStatus(
                                                                message.id,
                                                                "READ"
                                                            )
                                                        }
                                                        className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                                                    >
                                                        Read
                                                    </button>
                                                )}

                                            {message.status !==
                                                "REPLIED" && (
                                                    <button
                                                        onClick={() =>
                                                            updateStatus(
                                                                message.id,
                                                                "REPLIED"
                                                            )
                                                        }
                                                        className="rounded-lg border border-green-200 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50"
                                                    >
                                                        Replied
                                                    </button>
                                                )}

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        message
                                                    )
                                                }
                                                className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                                                title="Delete message"
                                            >
                                                <Trash2 size={17} />
                                            </button>

                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>
                    )}

                </div>
            </div>

            {/* Message Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-5">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Message Details
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Received{" "}
                                    {formatDate(
                                        selectedMessage.created_at
                                    )}
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setSelectedMessage(null)
                                }
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <div className="space-y-6 p-6">

                            <div className="grid gap-5 sm:grid-cols-2">

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Name
                                    </p>

                                    <p className="mt-1 font-medium text-slate-900">
                                        {
                                            selectedMessage.name
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Email
                                    </p>

                                    <p className="mt-1 font-medium text-slate-900">
                                        {
                                            selectedMessage.email
                                        }
                                    </p>
                                </div>

                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Subject
                                </p>

                                <p className="mt-1 text-lg font-semibold text-slate-900">
                                    {
                                        selectedMessage.subject
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Message
                                </p>

                                <div className="mt-2 rounded-xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                                    {
                                        selectedMessage.message
                                    }
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Status
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2">

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                selectedMessage.id,
                                                "UNREAD"
                                            )
                                        }
                                        className={`rounded-lg px-4 py-2 text-sm font-medium ${
                                            selectedMessage.status ===
                                            "UNREAD"
                                                ? "bg-red-100 text-red-700"
                                                : "border border-slate-300 text-slate-600"
                                        }`}
                                    >
                                        Unread
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                selectedMessage.id,
                                                "READ"
                                            )
                                        }
                                        className={`rounded-lg px-4 py-2 text-sm font-medium ${
                                            selectedMessage.status ===
                                            "READ"
                                                ? "bg-blue-100 text-blue-700"
                                                : "border border-slate-300 text-slate-600"
                                        }`}
                                    >
                                        Read
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                selectedMessage.id,
                                                "REPLIED"
                                            )
                                        }
                                        className={`rounded-lg px-4 py-2 text-sm font-medium ${
                                            selectedMessage.status ===
                                            "REPLIED"
                                                ? "bg-green-100 text-green-700"
                                                : "border border-slate-300 text-slate-600"
                                        }`}
                                    >
                                        Replied
                                    </button>

                                </div>
                            </div>

                        </div>

                        <div className="flex justify-end border-t border-slate-200 px-6 py-5">

                            <button
                                onClick={() =>
                                    setSelectedMessage(null)
                                }
                                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                Close
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;