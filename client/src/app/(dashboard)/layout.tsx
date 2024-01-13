"use client";

import Link from "next/link";

import RequireAuth from "../lib/RequireAuth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { logoutUser } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: any) {
    const [isProfileModalOpe, setIsProfileModalOpend] = useState(false);

    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const router = useRouter();

    return (
        <RequireAuth>
            <div>
                <div className="h-[50px] w-full bg-white border-b border-tableBorderColor shadow-sm flex items-center justify-between px-4">
                    <h1 className="font-bold text-lg">
                        <Link href="/">
                            PROJECT <span className="text-primaryColor">X</span>
                        </Link>
                    </h1>
                    <div className="relative">
                        <div
                            className="w-[30px] h-[30px] bg-grayColor rounded-full overflow-hidden cursor-pointer"
                            onClick={() => setIsProfileModalOpend(!isProfileModalOpe)}
                        >
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.name}&background=random&color=fff`}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {isProfileModalOpe && (
                            <div className="absolute z-10 right-0 bg-white shadow-[0_5px_10px_rgb(30_32_37_/_12%)] rounded min-w-[180px] py-2">
                                <span
                                    className="flex items-center gap-[10px] text-sm py-[6px] px-4 cursor-pointer hover:bg-[#f3f6f9]"
                                    onClick={() => {
                                        dispatch(logoutUser());
                                        router.push("/login");
                                    }}
                                >
                                    <BiLogOut />
                                    Logout
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-[1300px] max-w-[100%] mx-auto">{children}</div>
            </div>
        </RequireAuth>
    );
}
