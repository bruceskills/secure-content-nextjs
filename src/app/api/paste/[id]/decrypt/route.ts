import { decryptContent } from '@/utils/crypto';
import { getPaste } from '@/utils/storage';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json({ error: 'Password is mandatory' }, { status: 400 });
        }

        const paste = await getPaste(params.id);

        if (!paste) {
            return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
        }

        if (!paste.encrypted) {
            return NextResponse.json({ error: 'Paste is not encrypted' }, { status: 400 });
        }

        try {
            const decryptedContent = await decryptContent(paste.content, password);
            return NextResponse.json({ content: decryptedContent });
        } catch (error) {
            console.error(error instanceof Error ? error.message : 'Incorrect password. Please try again.');
            return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
        }
    } catch (error) {
        console.error(error instanceof Error ? error.message : 'Error decrypting. Please try again.');
        return NextResponse.json({ error: 'Error decrypting' }, { status: 500 });
    }
}
