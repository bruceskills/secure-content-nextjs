export const uuid = () =>
    'xxxxxxxx-xxxx-4xxx-Nxxx-xxxxxxxxxxxx'
        .replace(/x/g, () => ((Math.random() * 16) | 0).toString(16))
        .replace(/N/g, () => ((Math.random() * 4) | (0 + 8)).toString(16));

export function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString('pt-BR');
}

export function getExpirationTime(hours: number): number {
    return Date.now() + hours * 60 * 60 * 1000;
}
