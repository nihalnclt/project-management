import axios from "@/axios";
import { addNewTeamMembers } from "@/redux/slices/projectSlice";
import { RootState } from "@/redux/store";
import { TeamMember } from "@/types";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface TeamMembersModalProps {
    setIsTeamMembersModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TeamMembersModal({ setIsTeamMembersModalOpen }: TeamMembersModalProps) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { jwtToken } = useSelector((state: RootState) => state.user);
    const { project, teamMembers } = useSelector((state: RootState) => state.project);
    const dispatch = useDispatch();

    const addTeamMember = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const response = await axios.post(
                `/projects/${project?.id}/invite`,
                { email },
                {
                    headers: { Authorization: "Bearer " + jwtToken },
                }
            );

            dispatch(addNewTeamMembers(response.data?.temMember))

            setEmail("");
            setIsLoading(false);
        } catch (err: AxiosError | any) {
            setError(err?.response?.data?.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto">
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">Team Members</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsTeamMembersModalOpen(false)}
                    >
                        x
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={addTeamMember}>
                        <div className="flex items-center gap-2">
                            <input
                                type="email"
                                placeholder="Enter email address"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email || ""}
                                required
                            />
                            <button className="px-3 whitespace-nowrap">
                                {isLoading ? "Loading.." : "Add"}
                            </button>
                        </div>
                        {error && <span className="text-sm text-red-500 block mt-2">{error}</span>}
                    </form>
                    <div>
                        {teamMembers &&
                            teamMembers.map((teamMember, index) => {
                                return (
                                    <div key={index} className="flex items-center gap-2 mt-3">
                                        <div className="w-[35px] h-[35px] bg-grayColor rounded-full overflow-hidden">
                                            <img
                                                src="https://t4.ftcdn.net/jpg/03/49/49/79/360_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.webp"
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <span className="block leading-5 capitalize">
                                                {teamMember.user.name}
                                            </span>
                                            <span className="block text-sm text-grayColor leading-5">
                                                {teamMember.user.email}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}
