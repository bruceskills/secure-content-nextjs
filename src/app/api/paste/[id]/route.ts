import { deletePaste, getPaste, incrementViewCount } from '@/utils/storage';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const paste = await getPaste(params.id);

        if (!paste) {
            return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
        }

        if (paste.expiresAt && Date.now() > paste.expiresAt) {
            await deletePaste(params.id);
            return NextResponse.json({ error: 'Expired paste' }, { status: 410 });
        }

        if (paste.maxViews && paste.viewCount >= paste.maxViews) {
            await deletePaste(params.id);
            return NextResponse.json({ error: 'Viewing limit reached' }, { status: 410 });
        }

        await incrementViewCount(params.id);

        if (paste.encrypted) {
            return NextResponse.json({
                id: paste.id,
                encrypted: true,
                createdAt: paste.createdAt,
                viewCount: paste.viewCount + 1,
            });
        }

        return NextResponse.json(paste);
    } catch (error) {
        console.error(error instanceof Error ? error.message : 'Error searching for paste. Please try again.');
        return NextResponse.json({ error: 'Error searching for paste' }, { status: 500 });
    }
}
