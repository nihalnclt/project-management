"use client";

import axios from "@/axios";
import { updateLoginInfo } from "@/redux/slices/userSlice";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleLogin = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const response = await axios.post("/login", data);

            dispatch(updateLoginInfo(response.data));
            router.replace('/');
        } catch (err: AxiosError | any) {
            if (typeof err?.response?.data?.error === "string") {
                setError(err?.response?.data?.error);
            } else {
                setError("something went wrong, Try again");
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-[100vh]">
            <div className="border border-tableBorderColor rounded p-7 w-[450px] max-w-[100%]">
                <div className="text-center mb-4">
                    <h2 className="font-bold text-lg">Login</h2>
                    <span className="text-sm text-grayColor font-medium block mt-1">
                        Welcome Back To ProjectX
                    </span>
                </div>
                <form action="" onSubmit={handleLogin}>
                    <div className="mt-4">
                        <label htmlFor="">Email *</label>
                        <input
                            type="email"
                            placeholder="Ex: john@gmail.com"
                            name="email"
                            onChange={handleChange}
                            value={data.email || ""}
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Password *</label>
                        <input
                            type="password"
                            placeholder="********"
                            name="password"
                            onChange={handleChange}
                            value={data.password || ""}
                            required
                        />
                    </div>
                    {error && <span className="text-sm text-red-500 block mt-2">{error}</span>}
                    <button className="w-full mt-4" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
