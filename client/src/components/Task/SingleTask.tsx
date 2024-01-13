import React from "react";
import { useDrag } from "react-dnd";

import { Task, TaskStatus } from "@/types";

interface SingleTaskProps {
    task: Task;
    changeTaskStatus: (id: number, hoverStatus: TaskStatus) => Promise<void>;
}

interface DropResultProps {
    status: TaskStatus;
}

export default function SingleTask({ task, changeTaskStatus }: SingleTaskProps) {
    const [{ isDragging }, drag] = useDrag({
        type: "CARD",
        item: { id: task.id, status: task.status },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end(draggedItem, monitor) {
            if (monitor.didDrop()) {
                const dropResult: DropResultProps | null = monitor.getDropResult();
                if (dropResult) {
                    if (dropResult?.status === draggedItem.status) {
                        return;
                    }

                    changeTaskStatus(draggedItem.id, dropResult?.status);
                }
            }
        },
    });

    return (
        <div
            className="border border-tableBorderColor rounded bg-white shadow-sm mt-2"
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className="p-2">
                <h3>{task.title}</h3>
                <p className="text-sm text-grayColor">{task?.description || ""}</p>
            </div>
            <div className="flex items-center gap-2 border-t  border-dashed p-2">
                <div className="w-[30px] h-[30px] bg-grayColor rounded-full overflow-hidden">
                    <img
                        src="https://t4.ftcdn.net/jpg/03/49/49/79/360_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.webp"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <span className="block text-sm font-medium">Nihal</span>
                    <span className="block text-[12px] text-grayColor">Assigned to:</span>
                </div>
            </div>
            {/* <span className="text-sm underline text-blue-500 block mt-1">Change Status</span> */}
        </div>
    );
}
