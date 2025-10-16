import type { Paste } from '@/types';

const pastes = new Map<string, Paste>();

export async function savePaste(paste: Paste): Promise<void> {
    pastes.set(paste.id, paste);
}

export async function getPaste(id: string): Promise<Paste | null> {
    return pastes.get(id) || null;
}

export async function deletePaste(id: string): Promise<void> {
    pastes.delete(id);
}

export async function incrementViewCount(id: string): Promise<void> {
    const paste = pastes.get(id);
    if (paste) {
        paste.viewCount++;
        pastes.set(id, paste);
    }
}
