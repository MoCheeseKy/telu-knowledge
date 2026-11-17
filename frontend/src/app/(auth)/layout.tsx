import React from "react";
import AuthLayout from "@/components/_layouts/AuthLayout"

export default function AuthRouteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthLayout>
            {children}
        </AuthLayout>
    );
}
