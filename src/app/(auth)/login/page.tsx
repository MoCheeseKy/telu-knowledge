import { Suspense } from "react";
import LoginView from "@/components/_views/Auth/Login";

/** Halaman masuk pengguna yang membungkus LoginView dalam batas Suspense. */
export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginView />
        </Suspense>
    );
}
