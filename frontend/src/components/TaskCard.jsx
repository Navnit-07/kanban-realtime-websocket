import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreVertical, Paperclip, MessageSquare, FileText } from "lucide-react";

const TaskCard = ({ task, onClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    const viewAttachment = (e, file) => {
        e.stopPropagation();
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`task-card ${isDragging ? "dragging" : ""}`}
            onClick={() => onClick(task)}
            data-testid={`task-card-${task.id}`}
        >
            <div className="task-header">
                <span className="task-title">{task.title}</span>
                <MoreVertical size={16} className="text-secondary" />
            </div>
            <p className="task-description">{task.description}</p>

            {task.attachments && task.attachments.length > 0 && (
                <div className="attachment-preview">
                    {task.attachments.map((file, idx) => (
                        <div
                            key={idx}
                            className="preview-item cursor-pointer hover-scale"
                            title={`View ${file.name}`}
                            onClick={(e) => viewAttachment(e, file)}
                        >
                            {file.type.startsWith("image/") ? (
                                <img src={file.data} alt={file.name} />
                            ) : (
                                <div className="file-icon">
                                    <FileText size={16} style={{ color: 'var(--accent-primary)' }} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="task-footer">
                <div className="task-badges">
                    <span className={`badge priority-${task.priority.toLowerCase()}`}>
                        {task.priority}
                    </span>
                    <span className={`badge category-${task.category.toLowerCase()}`}>
                        {task.category}
                    </span>
                </div>
                <div className="task-icons">
                    {task.attachments && task.attachments.length > 0 && (
                        <span className="text-secondary flex items-center gap-1">
                            <Paperclip size={12} />
                            <span style={{ fontSize: '0.7rem' }}>{task.attachments.length}</span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
