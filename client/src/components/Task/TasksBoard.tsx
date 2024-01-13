import React from "react";
import { useDrop } from "react-dnd";

import { Task, TaskStatus } from "@/types";
import SingleTask from "./SingleTask";

interface TasksBoardProps {
    tasks: Task[];
    boardStatus: TaskStatus;
    changeTaskStatus: (id: number, hoverStatus: TaskStatus) => Promise<void>;
    deleteTask: (taskId: number) => Promise<void>;
}

export default function TasksBoard({ tasks, boardStatus, changeTaskStatus, deleteTask }: TasksBoardProps) {
    const [{ handlerId }, drop] = useDrop({
        accept: "CARD",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        drop: (item, monitor) => {
            return { status: boardStatus };
        },
    });

    return (
        <div>
            <div className="bg-slate-200 rounded p-2">
                <h3 className="font-medium">
                    {boardStatus === TaskStatus.ToDo
                        ? "TODO"
                        : boardStatus === TaskStatus.InProgress
                        ? "In Progress"
                        : "Done"}
                </h3>
            </div>
            <div ref={drop} data-handler-id={handlerId} className="min-h-[50vh] pb-[200px]">
                {tasks?.length < 1 ? (
                    <div className="text-grayColor p-4 text-center text-sm font-medium">
                        No Tasks Found..!
                    </div>
                ) : (
                    tasks?.map((task, index) => {
                        return (
                            <SingleTask
                                key={index}
                                task={task}
                                changeTaskStatus={changeTaskStatus}
                                deleteTask={deleteTask}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}
