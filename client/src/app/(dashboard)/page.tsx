"use client";

import axios from "@/axios";
import { RootState } from "@/redux/store";
import { Project } from "@/types";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function HomePage() {
    const [projects, setProjects] = useState<Project[]>([]);

    const { jwtToken } = useSelector((state: RootState) => state.user);

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
                <div className="bg-white shadow-sm rounded">
                    <table className="w-full">
                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                            <tr>
                                <th className="font-[500] p-3">Id</th>
                                <th className="font-[500] p-3">Name</th>
                                <th className="font-[500] p-3">Owner</th>
                                <th className="font-[500] p-3">Description</th>
                                <th className="font-[500] p-3">Team</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {projects?.map((project, index) => {
                                return (
                                    <tr key={index} className="border-b border-tableBorderColor">
                                        <td className="p-3">{project?.id}</td>
                                        <td className="p-3 capitalize whitespace-nowrap">
                                            <Link
                                                href={`/projects/${project?.id}`}
                                                className="font-medium text-blue-500 underline"
                                            >
                                                {project?.name}
                                            </Link>
                                            <span className="block text-sm text-grayColor mt-1">
                                                Created at {moment(project.created_at).format("MMM DD YYYY")}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-[30px] h-[30px] rounded-full bg-slate-200 overflow-hidden">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${project?.owner?.name}&background=random&color=fff`}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <span className="block text-sm leading-4">
                                                        {project?.owner?.name}
                                                    </span>
                                                    <span className="block text-sm text-grayColor leading-4">
                                                        {project?.owner?.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm text-grayColor">
                                            {project?.description || "N/A"}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex">
                                                {project.team_members?.length < 1 ? (
                                                    <span>N/A</span>
                                                ) : (
                                                    project.team_members?.map((teamMember, index) => {
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
                                                    })
                                                )}
                                            </div>
                                        </td>
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
