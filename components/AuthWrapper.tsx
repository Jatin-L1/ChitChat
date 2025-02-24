"use client"; // This makes it a Client Component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (token) {
            setIsAuthenticated(true);
        } else {
            router.push("/login"); // Redirect to login page if no token found
        }
        setLoading(false);
    }, []);

    if (loading) return <div>Loading...</div>; // Prevents flickering

    return isAuthenticated ? <>{children}</> : null; // Show content if authenticated
}
