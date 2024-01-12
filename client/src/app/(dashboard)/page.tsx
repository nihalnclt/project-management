'use client';

import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";

export default function page() {
    const { user } = useSelector((state: RootState) => state.user);
    
    return <div>page {user?.name}</div>;
}
