import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Pastebin - Share Text',
    description: 'Share text quickly and securely',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
