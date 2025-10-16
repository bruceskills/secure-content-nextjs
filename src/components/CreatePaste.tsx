'use client';

import type { CreatePasteResponse } from '@/types';
import { uuid } from '@/utils/generator';
import React, { useEffect, useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import TextArea from './ui/TextArea';

import { CircleCheck, Copy, TriangleAlert } from 'lucide-react';

export default function CreatePaste() {
    const [content, setContent] = useState('');
    const [pasteUrl, setPasteUrl] = useState('');
    const [password, setPassword] = useState('');
    const [expiresIn, setExpiresIn] = useState('24');
    const [maxViews, setMaxViews] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [nonce, setNonce] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const timestamp = Date.now().toString();

        const url = new URL(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/paste/`);

        try {
            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Request-Nonce': nonce,
                    'X-Request-Timestamp': timestamp,
                },
                body: JSON.stringify({
                    content,
                    password: password || undefined,
                    expiresIn: expiresIn ? Number.parseInt(expiresIn) : undefined,
                    maxViews: maxViews ? Number.parseInt(maxViews) : undefined,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create paste');
            }

            const data: CreatePasteResponse = await response.json();

            setPasteUrl(data.url);

            setNonce('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error when creating paste. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!nonce) {
            setNonce(uuid());
        }
    }, [nonce]);

    function copyUrl() {
        navigator.clipboard.writeText(pasteUrl).then(() => {
            alert('URL copied to clipboard!');
        });
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4 bg-background text-foreground">
            <div>
                <label htmlFor="content" className="mb-2 block font-medium text-sm">
                    Content
                </label>
                <TextArea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your text here..."
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="password" className="mb-2 block font-medium text-sm">
                        Password
                    </label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password Protect"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="nonce" className="mb-2 block font-medium text-sm">
                        Signature
                    </label>
                    <Input id="nonce" type="text" value={nonce} readOnly={true} placeholder="Nonce" />
                </div>
            </div>

            {pasteUrl && (
                <div>
                    <label htmlFor="pasteUrl" className="mb-2 flex items-center gap-1 font-medium text-sm">
                        <CircleCheck width={18} /> Successfully created paste!
                    </label>
                    <div className="flex items-center gap-4">
                        <Input
                            id="pasteUrl"
                            type="text"
                            value={pasteUrl}
                            readOnly={true}
                            disabled={true}
                            placeholder="URL"
                        />
                        <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                            <Button
                                onClick={copyUrl}
                                type="button"
                                className="focus:-outline-offset-2 w-full appearance-none rounded-md text-base placeholder:text-gray-400 hover:cursor-pointer focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                            >
                                <Copy width={18} />
                            </Button>
                        </div>
                    </div>
                    <div id="result" className="result">
                        <div className="alert alert-warning flex items-center gap-2 text-sm">
                            <TriangleAlert width={18} />
                            <strong>Save your password!</strong> Without it, you won`t be able to decrypt the content.
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="expiresIn" className="mb-2 block font-medium text-sm">
                        Expires in (hours)
                    </label>
                    <Input
                        id="expiresIn"
                        type="number"
                        value={expiresIn}
                        onChange={(e) => setExpiresIn(e.target.value)}
                        placeholder="24"
                        min="1"
                    />
                </div>

                <div>
                    <label htmlFor="maxViews" className="mb-2 block font-medium text-sm">
                        Maximum views
                    </label>
                    <Input
                        id="maxViews"
                        type="number"
                        value={maxViews}
                        onChange={(e) => setMaxViews(e.target.value)}
                        placeholder="Unlimited"
                        min="1"
                    />
                </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full appearance-none rounded-md hover:cursor-pointer">
                {loading ? 'Creating...' : 'Create Paste'}
            </Button>
        </form>
    );
}
