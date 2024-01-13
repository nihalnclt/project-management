"use client";

import Link from "next/link";

import RequireAuth from "../lib/RequireAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function RootLayout({ children }: any) {
    const { user } = useSelector((state: RootState) => state.user);

    return (
        <RequireAuth>
            <div>
                <div className="h-[50px] w-full bg-white border-b border-tableBorderColor shadow-sm flex items-center justify-between px-4">
                    <h1 className="font-bold text-lg">
                        <Link href="/">
                            PROJECT <span className="text-primaryColor">X</span>
                        </Link>
                    </h1>
                    <div className="">
                        <div className="w-[30px] h-[30px] bg-grayColor rounded-full overflow-hidden">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.name}&background=random&color=fff`}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
                <div className="w-[1300px] max-w-[100%] mx-auto">{children}</div>
            </div>
        </RequireAuth>
    );
}
