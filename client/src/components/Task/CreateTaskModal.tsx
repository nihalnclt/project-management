import axios from "@/axios";
import { RootState } from "@/redux/store";
import { Task } from "@/types";
import React, { useState } from "react";
import { useSelector } from "react-redux";

interface CreateTaskModalProps {
    projectId: number;
    setIsTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    addNewTodoTask: (task: Task) => void;
}

export default function CreateTaskModal({
    projectId,
    setIsTaskModalOpen,
    addNewTodoTask,
}: CreateTaskModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        title: "",
        description: "",
    });
    const [error, setError] = useState("");

    const { jwtToken } = useSelector((state: RootState) => state.user);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleAddTask = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const resposne = await axios.post(`/tasks/${projectId}`, data, {
                headers: {
                    Authorization: "Bearer " + jwtToken,
                },
            });

            addNewTodoTask(resposne.data);
            setIsTaskModalOpen(false);
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto">
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Add Quota</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsTaskModalOpen(false)}
                    >
                        x
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleAddTask}>
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
                                onClick={() => setIsTaskModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className="w-[160px]" disabled={isLoading}>
                                {isLoading ? "Loading..." : "Add Task"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
