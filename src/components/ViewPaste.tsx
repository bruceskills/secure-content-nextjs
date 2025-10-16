'use client';

import { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';

interface ViewPasteProps {
    id: string;
    initialContent?: string;
    encrypted: boolean;
}

export default function ViewPaste({ id, initialContent, encrypted }: ViewPasteProps) {
    const [content, setContent] = useState(initialContent || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleDecrypt = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/paste/${id}/decrypt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                throw new Error('Incorrect password');
            }

            const data = await response.json();
            setContent(data.content);
        } catch (error) {
            console.error(error instanceof Error ? error.message : 'Incorrect password. Please try again.');
            setError('Incorrect password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (encrypted && !content) {
        return (
            <div className="w-full max-w-2xl space-y-4">
                <p className="text-center text-gray-600">This paste is password protected</p>
                <div className="flex gap-2">
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter the password"
                        onKeyPress={(e) => e.key === 'Enter' && handleDecrypt()}
                    />
                    <Button onClick={handleDecrypt} disabled={loading}>
                        {loading ? 'Unlocking...' : 'Unblock'}
                    </Button>
                </div>
                {error && <p className="text-center text-red-600 text-sm">{error}</p>}
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl space-y-4">
            <div className="flex justify-end">
                <Button onClick={handleCopy} variant="outline">
                    {copied ? 'Copied!' : 'Copy'}
                </Button>
            </div>
            <pre className="overflow-x-auto rounded-md border border-gray-300 bg-gray-50 p-4">
                <code>{content}</code>
            </pre>
        </div>
    );
}
