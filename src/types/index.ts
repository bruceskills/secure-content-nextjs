export interface Paste {
    id: string;
    content: string;
    encrypted: boolean;
    expiresAt?: number;
    createdAt: number;
    viewCount: number;
    maxViews?: number;
}

export interface CreatePasteRequest {
    content: string;
    password?: string;
    encoded?: Uint8Array;
    buffer?: Uint8Array;
    expiresIn?: number;
    maxViews?: number;
}

export interface CreatePasteResponse {
    id: string;
    url: string;
    encrypted: boolean;
}
