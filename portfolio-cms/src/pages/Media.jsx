import { useEffect, useRef, useState } from "react";
import {
    Images,
    Upload,
    Copy,
    Trash2,
    Check,
    FileImage,
    X
} from "lucide-react";

import api from "../services/api";

const Media = () => {
    const [media, setMedia] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [copiedId, setCopiedId] = useState(null);

    const fileInputRef = useRef(null);

    const loadMedia = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/upload/media");

            setMedia(response.data.data || []);
        } catch (err) {
            console.error("Load media error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load media"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMedia();
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            setSelectedFile(null);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be smaller than 5 MB.");
            setSelectedFile(null);
            return;
        }

        setError("");
        setSuccess("");
        setSelectedFile(file);
    };

    const uploadImage = async () => {
        if (!selectedFile) {
            setError("Please choose an image first.");
            return;
        }

        setUploading(true);
        setError("");
        setSuccess("");

        try {
            const formData = new FormData();

            formData.append(
                "image",
                selectedFile
            );

            await api.post(
                "/upload/image",
                formData
            );

            setSuccess(
                "Image uploaded successfully."
            );

            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            await loadMedia();
        } catch (err) {
            console.error(
                "Upload media error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to upload image"
            );
        } finally {
            setUploading(false);
        }
    };

    const cancelSelection = () => {
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const copyUrl = async (item) => {
        try {
            await navigator.clipboard.writeText(
                item.public_url
            );

            setCopiedId(item.id);

            setTimeout(() => {
                setCopiedId(null);
            }, 1500);
        } catch (err) {
            console.error(
                "Copy URL error:",
                err
            );

            setError(
                "Could not copy the URL."
            );
        }
    };

    const handleDelete = async (item) => {
        const confirmed = window.confirm(
            `Delete "${item.original_name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/upload/media/${item.id}`
            );

            setSuccess(
                "Media deleted successfully."
            );

            await loadMedia();
        } catch (err) {
            console.error(
                "Delete media error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete media"
            );
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) {
            return "0 B";
        }

        const units = [
            "B",
            "KB",
            "MB",
            "GB"
        ];

        const index = Math.floor(
            Math.log(bytes) / Math.log(1024)
        );

        return `${(
            bytes /
            Math.pow(1024, index)
        ).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
    };

    return (
        <div className="p-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-slate-900 p-3 text-white">
                            <Images size={22} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Media
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Upload and manage portfolio images.
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

                {/* Upload */}
                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

                    <h2 className="text-xl font-semibold text-slate-900">
                        Upload Image
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        JPEG, PNG, WEBP and GIF. Maximum size: 5 MB.
                    </p>

                    <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={handleFileChange}
                            className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
                        />

                        <button
                            onClick={uploadImage}
                            disabled={
                                uploading ||
                                !selectedFile
                            }
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Upload size={18} />

                            {uploading
                                ? "Uploading..."
                                : "Upload"}
                        </button>

                    </div>

                    {selectedFile && (
                        <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4">

                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-900">
                                    {selectedFile.name}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {formatFileSize(
                                        selectedFile.size
                                    )}
                                </p>
                            </div>

                            <button
                                onClick={cancelSelection}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-200"
                            >
                                <X size={18} />
                            </button>

                        </div>
                    )}

                </div>

                {/* Library */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Media Library
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {media.length} file
                            {media.length === 1
                                ? ""
                                : "s"} available.
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-slate-500">
                            Loading media...
                        </div>
                    ) : media.length === 0 ? (
                        <div className="p-12 text-center">

                            <Images
                                size={42}
                                className="mx-auto text-slate-300"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                No media yet
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Upload your first image.
                            </p>

                        </div>
                    ) : (
                        <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">

                            {media.map((item) => (
                                <div
                                    key={item.id}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                                >

                                    {/* Preview */}
                                    <div className="aspect-video bg-slate-100">
                                        <img
                                            src={item.public_url}
                                            alt={item.original_name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="p-5">

                                        <div className="flex items-start gap-3">
                                            <div className="rounded-lg bg-slate-100 p-2">
                                                <FileImage
                                                    size={18}
                                                    className="text-slate-600"
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-semibold text-slate-900">
                                                    {item.original_name}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {item.mime_type}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                                            <div className="rounded-lg bg-slate-50 p-3">
                                                <p className="text-slate-400">
                                                    Size
                                                </p>

                                                <p className="mt-1 font-medium text-slate-700">
                                                    {formatFileSize(
                                                        Number(
                                                            item.file_size
                                                        )
                                                    )}
                                                </p>
                                            </div>

                                            <div className="rounded-lg bg-slate-50 p-3">
                                                <p className="text-slate-400">
                                                    Uploaded
                                                </p>

                                                <p className="mt-1 font-medium text-slate-700">
                                                    {new Date(
                                                        item.created_at
                                                    ).toLocaleDateString(
                                                        "en-IN"
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <input
                                                readOnly
                                                value={
                                                    item.public_url
                                                }
                                                onFocus={(
                                                    event
                                                ) =>
                                                    event.target.select()
                                                }
                                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 outline-none"
                                            />
                                        </div>

                                        <div className="mt-4 flex gap-2">

                                            <button
                                                onClick={() =>
                                                    copyUrl(item)
                                                }
                                                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                            >
                                                {copiedId === item.id ? (
                                                    <>
                                                        <Check
                                                            size={16}
                                                        />
                                                        Copied
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy
                                                            size={16}
                                                        />
                                                        Copy URL
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        item
                                                    )
                                                }
                                                className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                                                title="Delete"
                                            >
                                                <Trash2
                                                    size={17}
                                                />
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

export default Media;