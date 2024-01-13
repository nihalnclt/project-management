import Link from "next/link";

import RequireAuth from "../lib/RequireAuth";

export default function RootLayout({ children }: any) {
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
                                src="https://t4.ftcdn.net/jpg/03/49/49/79/360_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.webp"
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
