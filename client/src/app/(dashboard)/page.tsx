"use client";

import axios from "@/axios";
import { RootState } from "@/redux/store";
import { Project } from "@/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function page() {
    const [projects, setProjects] = useState<Project[]>([]);

    const { jwtToken } = useSelector((state: RootState) => state.user);
    const router = useRouter();

    const fetchProjects = async () => {
        try {
            const response = await axios.get("/projects", {
                headers: {
                    Authorization: "Bearer " + jwtToken,
                },
            });

            setProjects(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="p-5">
            <h1 className="font-bold text-lg mb-2">Projects</h1>
            {projects?.length < 1 ? (
                <div className="p-6 flex flex-col items-center">
                    <span className="text-sm text-grayColor block mt-[6px]">Oops.. No Projects found</span>
                </div>
            ) : (
                <div>
                    <table className="w-full">
                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                            <tr>
                                <th className="font-[500] p-3">Id</th>
                                <th className="font-[500] p-3">Name</th>
                                <th className="font-[500] p-3">Description</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {projects?.map((project, index) => {
                                return (
                                    <tr
                                        key={index}
                                        className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
                                        onClick={() => router.push(`/projects/${project.id}`)}
                                    >
                                        <td className="p-3">{project?.id}</td>
                                        <td className="p-3 capitalize">{project?.name}</td>
                                        <td className="p-3 capitalize">{project?.description || "N/A"}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
