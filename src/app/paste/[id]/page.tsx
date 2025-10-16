import ViewPaste from '@/components/ViewPaste';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getPasteData(id: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/paste/${id}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(error instanceof Error ? error.message : 'Error searching for paste. Please try again.');
        return null;
    }
}

export default async function PastePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const paste = await getPasteData(resolvedParams.id);

    if (!paste) {
        notFound();
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="w-full max-w-2xl">
                <Link href="/" className="mb-4 inline-block text-blue-600 hover:underline">
                    ← Create new paste
                </Link>
                <div className="rounded-lg bg-white p-8 shadow-lg">
                    <ViewPaste id={resolvedParams.id} initialContent={paste.content} encrypted={paste.encrypted} />
                </div>
            </div>
        </main>
    );
}
