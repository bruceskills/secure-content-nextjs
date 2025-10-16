export async function encryptContent(content: string, password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);

    const passwordKey = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
        'deriveBits',
        'deriveKey',
    ]);

    const salt = crypto.getRandomValues(new Uint8Array(16));

    const key = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256',
        },
        passwordKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt'],
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, data);

    const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

    return Buffer.from(combined).toString('base64');
}

export async function decryptContent(encryptedContent: string, password: string): Promise<string> {
    const encoder = new TextEncoder();
    const combined = Buffer.from(encryptedContent, 'base64');

    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const data = combined.slice(28);

    const passwordKey = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
        'deriveBits',
        'deriveKey',
    ]);

    const key = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256',
        },
        passwordKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt'],
    );

    const decryptedData = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, data);

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
}
