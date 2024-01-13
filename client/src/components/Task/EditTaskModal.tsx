import axios from "@/axios";
import { updateTask } from "@/redux/slices/projectSlice";
import { RootState } from "@/redux/store";
import { Task, TeamMember } from "@/types";
import { AxiosError } from "axios";
import React, { useDebugValue, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface EditTaskModalProps {
    setIsEditTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    task: Task;
}

export default function EditTaskModal({ setIsEditTaskModalOpen, task }: EditTaskModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        title: task.title || "",
        description: task.description || "",
        assignee: task?.assignee?.id || "",
    });
    const [error, setError] = useState("");

    const { jwtToken } = useSelector((state: RootState) => state.user);
    const { project, teamMembers } = useSelector((state: RootState) => state.project);
    const dispatch = useDispatch();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleUpdateTask = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const resposne = await axios.patch(`/projects/${project?.id}/tasks/${task.id}`, data, {
                headers: {
                    Authorization: "Bearer " + jwtToken,
                },
            });

            dispatch(updateTask(resposne.data));
            setIsEditTaskModalOpen(false);
        } catch (err: AxiosError | any) {
            setError(err?.response?.data?.error || "Something went wrong");
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto">
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">Update Task</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsEditTaskModalOpen(false)}
                    >
                        x
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleUpdateTask}>
                        <div>
                            <label htmlFor="">Title *</label>
                            <input
                                type="text"
                                placeholder="Enter Title"
                                name="title"
                                onChange={handleChange}
                                value={data.title || ""}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Assignee</label>
                            <select name="assignee" id="" value={data.assignee || ""} onChange={handleChange}>
                                <option value="">Select Assignee</option>
                                {teamMembers?.map((member, index) => {
                                    return (
                                        <option value={member.user.id} key={index}>
                                            {member.user.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Description</label>
                            <textarea
                                name="description"
                                placeholder="Enter Description"
                                onChange={handleChange}
                                value={data.description || ""}
                            ></textarea>
                        </div>
                        {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => setIsEditTaskModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className="w-[160px]" disabled={isLoading}>
                                {isLoading ? "Loading..." : "Update Task"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
