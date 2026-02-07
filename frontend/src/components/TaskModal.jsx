import React, { useState, useEffect } from "react";
import { X, Upload, Trash2, Eye, FileText } from "lucide-react";

const TaskModal = ({ isOpen, onClose, onSave, onDelete, task }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [category, setCategory] = useState("Feature");
    const [status, setStatus] = useState("TODO");
    const [attachments, setAttachments] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (task) {
            setTitle(task.title || "");
            setDescription(task.description || "");
            setPriority(task.priority || "Medium");
            setCategory(task.category || "Feature");
            setStatus(task.status || "TODO");
            setAttachments(task.attachments || []);
        } else {
            setTitle("");
            setDescription("");
            setPriority("Medium");
            setCategory("Feature");
            setStatus("TODO");
            setAttachments([]);
        }
        setError("");
    }, [task, isOpen]);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = [];
        let fileError = "";

        files.forEach((file) => {
            // Validate file type
            const isValidType = file.type.startsWith("image/") || file.type === "application/pdf";
            if (!isValidType) {
                fileError = "Invalid file type. Only Images and PDFs are allowed.";
                return;
            }

            // Validate file size (e.g., 2MB)
            if (file.size > 2 * 1024 * 1024) {
                fileError = "File too large. Max 2MB allowed.";
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachments((prev) => [
                    ...prev,
                    {
                        name: file.name,
                        type: file.type,
                        data: reader.result,
                    },
                ]);
            };
            reader.readAsDataURL(file);
        });

        if (fileError) setError(fileError);
    };

    const removeAttachment = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const viewAttachment = (file) => {
        try {
            const base64Data = file.data.includes(",") ? file.data.split(",")[1] : file.data;
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: file.type });
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL, "_blank");
        } catch (e) {
            console.error("Error viewing attachment:", e);
            window.open(file.data, "_blank");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        onSave({
            id: task?.id,
            title,
            description,
            priority,
            category,
            status,
            attachments,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} data-testid="task-modal">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{task ? "Edit Task" : "Create New Task"}</h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary">
                        <X size={24} />
                    </button>
                </div>

                {error && <div className="text-danger mb-4 text-sm" data-testid="modal-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title"
                            data-testid="input-title"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description"
                            rows={3}
                            data-testid="input-description"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Priority</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)} data-testid="select-priority">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} data-testid="select-category">
                                <option value="Bug">Bug</option>
                                <option value="Feature">Feature</option>
                                <option value="Enhancement">Enhancement</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} data-testid="select-status">
                            <option value="TODO">To Do</option>
                            <option value="INPROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Attachments (Images/PDFs)</label>
                        <div className="flex items-center gap-2">
                            <label className="btn btn-secondary flex items-center gap-2 cursor-pointer">
                                <Upload size={16} />
                                <span>Upload</span>
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    multiple
                                    accept="image/*,application/pdf"
                                    style={{ display: 'none' }}
                                    data-testid="input-file"
                                />
                            </label>
                        </div>
                        <div className="attachment-preview mt-2">
                            {attachments.map((file, idx) => (
                                <div key={idx} className="preview-item group relative">
                                    {file.type.startsWith("image/") ? (
                                        <img src={file.data} alt={file.name} />
                                    ) : (
                                        <div className="file-icon flex flex-col items-center gap-1">
                                            <FileText size={20} style={{ color: 'var(--accent-primary)' }} />
                                            <span style={{ fontSize: '0.6rem' }}>PDF</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: 'rgba(0,0,0,0.6)', position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <button
                                            type="button"
                                            onClick={() => viewAttachment(file)}
                                            className="p-1 text-white rounded hover:bg-white hover:bg-opacity-20 transition-colors"
                                            style={{ background: 'var(--accent-primary)', border: 'none', padding: '4px', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                                            title="View"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(idx)}
                                            className="p-1 text-white rounded hover:bg-white hover:bg-opacity-20 transition-colors"
                                            style={{ background: 'var(--danger)', border: 'none', padding: '4px', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between gap-4 mt-8">
                        {task && (
                            <button
                                type="button"
                                onClick={() => {
                                    onDelete(task.id);
                                    onClose();
                                }}
                                className="btn btn-danger"
                                data-testid="btn-delete"
                            >
                                Delete
                            </button>
                        )}
                        <div className="flex gap-2" style={{ marginLeft: 'auto' }}>
                            <button type="button" onClick={onClose} className="btn btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" data-testid="btn-save">
                                {task ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
