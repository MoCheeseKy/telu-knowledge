import { Suspense } from "react";
import LoginView from "@/components/_views/Auth/Login";

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginView />
        </Suspense>
    );
}
