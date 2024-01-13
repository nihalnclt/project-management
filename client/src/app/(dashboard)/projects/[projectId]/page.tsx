"use client";

import axios from "@/axios";
import TeamMembersModal from "@/components/Project/TeamMembersModal";
import CreateTaskModal from "@/components/Task/CreateTaskModal";
import TasksBoard from "@/components/Task/TasksBoard";
import { RootState } from "@/redux/store";
import { Project, Task, TaskStatus, TeamMember, User } from "@/types";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";

interface SingleProjectPageProps {
    params: {
        projectId: number;
    };
}

interface TaskMap {
    [index: number]: Task[];
}

const statuses: TaskStatus[] = Object.values(TaskStatus);

export default function SingleProjectPage({ params }: SingleProjectPageProps) {
    const [project, setProject] = useState<Project>();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isTeamMembersModalOpen, setIsTeamMembersModalOpen] = useState(false);

    const { jwtToken } = useSelector((state: RootState) => state.user);

    const fetchSingleProject = async () => {
        try {
            const response = await axios.get(`/projects/${params.projectId}`, {
                headers: { Authorization: "Bearer " + jwtToken },
            });

            setProject(response.data?.project);
            setTeamMembers(response?.data?.project?.team_members || []);
            setTasks(response.data?.tasks);
        } catch (err) {
            console.log(err);
        }
    };

    const addNewTodoTask = (task: Task) => {
        setTasks((prev) => {
            return [...prev, task];
        });
    };

    const addNewTeamMembers = (teamMember: TeamMember) => {
        setTeamMembers((prev) => {
            return [...prev, teamMember];
        });
    };

    const changeTaskStatus = async (id: number, hoverStatus: TaskStatus) => {
        try {
            const taskIndex = tasks.findIndex((t) => t.id === id);
            if (taskIndex !== -1) {
                tasks[taskIndex].status = hoverStatus;
                setTasks(JSON.parse(JSON.stringify(tasks)));

                await axios.post(
                    `/tasks/${params.projectId}/${id}/change-status`,
                    { status: hoverStatus },
                    { headers: { Authorization: "Bearer " + jwtToken } }
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const deleteTask = async (taskId: number) => {
        try {
            const isConfirm = window.confirm("Are you sure you want to delete?");
            if (isConfirm) {
                await axios.delete(`/tasks/${params.projectId}/${taskId}`, {
                    headers: { Authorization: "Bearer " + jwtToken },
                });

                const filteredTasks = tasks.filter((task) => task.id !== taskId);
                setTasks(filteredTasks);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchSingleProject();
    }, []);

    return (
        <div className="p-5">
            <div className="bg-white shadow-sm flex items-start justify-between gap-5 p-5">
                <div>
                    <h1 className="text-lg font-bold">{project?.name}</h1>
                    <p className="mt-2 text-sm text-grayColor">{project?.description}</p>
                    {/* <span>Created - </span> */}
                </div>
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
                {isTeamMembersModalOpen && (
                    <TeamMembersModal
                        setIsTeamMembersModalOpen={setIsTeamMembersModalOpen}
                        projectId={params.projectId}
                        addNewTeamMembers={addNewTeamMembers}
                        teamMembers={teamMembers}
                    />
                )}
                {isTaskModalOpen && (
                    <CreateTaskModal
                        projectId={params.projectId}
                        setIsTaskModalOpen={setIsTaskModalOpen}
                        addNewTodoTask={addNewTodoTask}
                    />
                )}
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
                                changeTaskStatus={changeTaskStatus}
                                deleteTask={deleteTask}
                            />
                        );
                    })}
                </div>
            </DndProvider>
        </div>
    );
}
