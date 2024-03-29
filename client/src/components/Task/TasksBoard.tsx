import React from "react";
import { useDrop } from "react-dnd";

import { Task, TaskStatus } from "@/types";
import SingleTask from "./SingleTask";

interface TasksBoardProps {
    tasks: Task[];
    boardStatus: TaskStatus;
}

export default function TasksBoard({ tasks, boardStatus }: TasksBoardProps) {
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
                        ? "IN PROGRESS"
                        : "DONE"}
                </h3>
            </div>
            <div ref={drop} data-handler-id={handlerId} className="min-h-[50vh] pb-[200px]">
                {tasks?.length < 1 ? (
                    <div className="text-grayColor p-4 text-center text-sm">
                        <span className="font-medium">No Tasks Found..!</span>
                        <span className="block mt-1">Add new Task or Drag and Drop task to this board</span>
                    </div>
                ) : (
                    tasks?.map((task, index) => {
                        return <SingleTask key={index} task={task} />;
                    })
                )}
            </div>
        </div>
    );
}
