import React, { useState } from "react";
import { useDrag } from "react-dnd";

import { Task, TaskStatus } from "@/types";
import { MdDelete, MdOutlineModeEdit } from "react-icons/md";
import axios from "@/axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { changeTaskStatus, deleteTask } from "@/redux/slices/projectSlice";
import EditTaskModal from "./EditTaskModal";

interface SingleTaskProps {
    task: Task;
}

interface DropResultProps {
    status: TaskStatus;
}

export default function SingleTask({ task }: SingleTaskProps) {
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);

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

                    updateTaskStatus(draggedItem.id, dropResult?.status);
                }
            }
        },
    });

    const { jwtToken, user } = useSelector((state: RootState) => state.user);
    const { project, tasks } = useSelector((state: RootState) => state.project);
    const dispatch = useDispatch();

    const updateTaskStatus = async (id: number, hoverStatus: TaskStatus) => {
        try {
            const taskIndex = tasks.findIndex((t) => t.id === id);
            if (taskIndex !== -1) {
                dispatch(changeTaskStatus({ taskIndex, hoverStatus }));

                await axios.post(
                    `/projects/${project?.id}/tasks/${id}/change-status`,
                    { status: hoverStatus },
                    { headers: { Authorization: "Bearer " + jwtToken } }
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const deleteSingleTask = async (taskId: number) => {
        try {
            const isConfirm = window.confirm("Are you sure you want to delete?");
            if (isConfirm) {
                await axios.delete(`/projects/${project?.id}/tasks/${taskId}`, {
                    headers: { Authorization: "Bearer " + jwtToken },
                });

                dispatch(deleteTask(taskId));
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div
            className="border border-tableBorderColor rounded bg-white shadow-sm mt-2"
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className="p-2">
                <h3 className="font-medium text-[15px]">{task.title}</h3>
                <p className="text-sm text-grayColor">{task?.description || ""}</p>
            </div>
            <div className="border-t border-dashed p-2 flex items-center justify-between">
                {task.assignee ? (
                    <div className="flex items-center gap-2">
                        <div className="w-[30px] h-[30px] bg-grayColor rounded-full overflow-hidden">
                            <img
                                src={`https://ui-avatars.com/api/?name=${task?.assignee?.name}&background=random&color=fff`}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <span className="block text-sm font-medium leading-4">
                                {task?.assignee?.name}
                            </span>
                            <span className="block text-sm text-grayColor leading-4">
                                {task?.assignee?.email}
                            </span>
                        </div>
                    </div>
                ) : (
                    <span className="text-sm text-grayColor">Not Assigned</span>
                )}
                {project?.owner?.id === user?.id && (
                    <div className="flex gap-2">
                        <button
                            className="bg-transparent h-auto text-green-500 text-lg"
                            onClick={() => setIsEditTaskModalOpen(true)}
                        >
                            <MdOutlineModeEdit />
                        </button>
                        <button
                            className="bg-transparent h-auto text-red-500 text-lg"
                            onClick={() => deleteSingleTask(task.id)}
                        >
                            <MdDelete />
                        </button>

                        {isEditTaskModalOpen && (
                            <EditTaskModal setIsEditTaskModalOpen={setIsEditTaskModalOpen} task={task} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
