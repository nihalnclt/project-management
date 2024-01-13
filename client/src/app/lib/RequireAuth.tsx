"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";

export default function RequireAuth({ children }: any) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const dispatch = useDispatch();

    const fetchCurrentUser = async (jwtToken: string | null) => {
        try {
            const response = await axios.get("/me", {
                headers: {
                    Authorization: "Bearer " + jwtToken,
                },
            });

            dispatch(setUser({ user: response.data, access_token: jwtToken || "" }));
            setIsLoading(false);
        } catch (err) {
            router.push("/login");
        }
    };

    useEffect(() => {
        const jwtToken = localStorage.getItem("token");
        if (!jwtToken) router.push("/login");

        fetchCurrentUser(jwtToken);
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}
