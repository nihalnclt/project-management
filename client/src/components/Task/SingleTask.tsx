import React from "react";
import { useDrag } from "react-dnd";

import { Task, TaskStatus } from "@/types";
import { MdDelete, MdOutlineModeEdit } from "react-icons/md";

interface SingleTaskProps {
    task: Task;
    changeTaskStatus: (id: number, hoverStatus: TaskStatus) => Promise<void>;
    deleteTask: (taskId: number) => Promise<void>;
}

interface DropResultProps {
    status: TaskStatus;
}

export default function SingleTask({ task, changeTaskStatus, deleteTask }: SingleTaskProps) {
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
            <div className="border-t border-dashed p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-[30px] h-[30px] bg-grayColor rounded-full overflow-hidden">
                        <img
                            src="https://t4.ftcdn.net/jpg/03/49/49/79/360_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.webp"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <span className="block text-sm font-medium leading-4">Nihal</span>
                        <span className="block text-sm text-grayColor leading-4">nihalnclt@gmail.com</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="bg-transparent h-auto text-green-500 text-lg">
                        <MdOutlineModeEdit />
                    </button>
                    <button
                        className="bg-transparent h-auto text-red-500 text-lg"
                        onClick={() => deleteTask(task.id)}
                    >
                        <MdDelete />
                    </button>
                </div>
            </div>
            {/* <span className="text-sm underline text-blue-500 block mt-1">Change Status</span> */}
        </div>
    );
}
