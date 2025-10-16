import CreatePaste from '@/components/CreatePaste';

import { ShieldAlert } from 'lucide-react';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="w-full max-w-2xl">
                <h1 className="mb-2 flex items-center justify-center gap-2 text-center font-bold text-4xl">
                    <ShieldAlert width={40} height={40} /> Pastebin Encrypted
                </h1>
                <p className="mb-8 text-center text-gray-600">Share text quickly and securely!</p>
                <div className="rounded-lg bg-white p-8 shadow-lg">
                    <CreatePaste />
                </div>
            </div>
        </main>
    );
}
