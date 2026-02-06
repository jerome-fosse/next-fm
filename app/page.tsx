'use client';

import LoginForm from "@/app/ui/login/login-form";

export default function Page() {
    return (
        <div className="flex max-w-full h-screen overflow-hidden font-sans">
            <div className="m-auto w-1/2 max-w-md p-4 border border-gray-300 rounded-md shadow-md">
                <LoginForm />
            </div>
        </div>
    );
}
