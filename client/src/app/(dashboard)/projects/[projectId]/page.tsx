"use client";

import axios from "@/axios";
import TeamMembersModal from "@/components/Project/TeamMembersModal";
import CreateTaskModal from "@/components/Task/CreateTaskModal";
import TasksBoard from "@/components/Task/TasksBoard";
import { updateInitialData } from "@/redux/slices/projectSlice";
import { RootState } from "@/redux/store";
import { TaskStatus } from "@/types";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch, useSelector } from "react-redux";

interface SingleProjectPageProps {
    params: {
        projectId: number;
    };
}

const statuses: TaskStatus[] = Object.values(TaskStatus);

export default function SingleProjectPage({ params }: SingleProjectPageProps) {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isTeamMembersModalOpen, setIsTeamMembersModalOpen] = useState(false);

    const { jwtToken, user } = useSelector((state: RootState) => state.user);
    const { project, tasks, teamMembers } = useSelector((state: RootState) => state.project);
    const dispatch = useDispatch();

    const fetchSingleProject = async () => {
        try {
            const response = await axios.get(`/projects/${params.projectId}`, {
                headers: { Authorization: "Bearer " + jwtToken },
            });

            dispatch(
                updateInitialData({
                    project: response.data?.project,
                    teamMembers: response?.data?.project?.team_members || [],
                    tasks: response.data?.tasks,
                })
            );
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchSingleProject();
    }, []);

    return (
        <div className="p-5">
            <div className="bg-white shadow-sm rounded flex items-start justify-between gap-5 p-5">
                <div>
                    <h1 className="text-lg font-bold">{project?.name}</h1>
                    <p className="mt-1 text-[15px] text-grayColor leading-6">{project?.description}</p>
                    {teamMembers?.length > 0 && (
                        <div className="flex mt-3">
                            {teamMembers?.map((teamMember, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="w-[30px] h-[30px] rounded-full bg-slate-200 mr-[-10px] overflow-hidden border-2 border-white"
                                        title={teamMember?.user?.name}
                                    >
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${teamMember?.user?.name}&background=random&color=fff`}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                {project?.owner?.id === user?.id && (
                    <div className="flex gap-2">
                        <button
                            className="px-3 bg-orange-500 whitespace-nowrap"
                            onClick={() => setIsTeamMembersModalOpen(true)}
                        >
                            Team ({teamMembers?.length})
                        </button>
                        <button className="px-3 whitespace-nowrap" onClick={() => setIsTaskModalOpen(true)}>
                            + Create Task
                        </button>
                    </div>
                )}
                {isTeamMembersModalOpen && (
                    <TeamMembersModal setIsTeamMembersModalOpen={setIsTeamMembersModalOpen} />
                )}
                {isTaskModalOpen && <CreateTaskModal setIsTaskModalOpen={setIsTaskModalOpen} />}
            </div>

            <DndProvider backend={HTML5Backend}>
                <div className="grid grid-cols-3 gap-5 mt-5">
                    {statuses.map((boardStatus, index) => {
                        return (
                            <TasksBoard
                                key={index}
                                tasks={tasks?.filter((task) => {
                                    return task.status === boardStatus;
                                })}
                                boardStatus={boardStatus}
                            />
                        );
                    })}
                </div>
            </DndProvider>
        </div>
    );
}
