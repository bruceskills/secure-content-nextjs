import type { CreatePasteRequest, Paste } from '@/types';
import { encryptContent } from '@/utils/crypto';
import { getExpirationTime } from '@/utils/generator';
import { savePaste } from '@/utils/storage';
import { nanoid } from 'nanoid';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body: CreatePasteRequest = await request.json();
        const { content, password, expiresIn, maxViews } = body;

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const id = nanoid(20);
        let finalContent = content;
        let encrypted = false;

        if (password) {
            finalContent = await encryptContent(content, password);
            encrypted = true;
        }

        const paste: Paste = {
            id,
            content: finalContent,
            encrypted,
            createdAt: Date.now(),
            viewCount: 0,
            ...(expiresIn && { expiresAt: getExpirationTime(expiresIn) }),
            ...(maxViews && { maxViews }),
        };

        await savePaste(paste);

        return NextResponse.json({
            id,
            url: `${request.nextUrl.origin}/paste/${id}`,
            encrypted,
        });
    } catch (error) {
        console.error(error instanceof Error ? error.message : 'Error when creating paste. Please try again.');
        return NextResponse.json({ error: 'Error creating paste' }, { status: 500 });
    }
}
