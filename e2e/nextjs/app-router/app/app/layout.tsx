import type { Metadata } from 'next'
import React from 'react'
import { DevCycleClientsideProvider } from '@devcycle/nextjs-sdk'
import { getClientContext } from './shared'

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <DevCycleClientsideProvider context={await getClientContext()}>
                    {children}
                </DevCycleClientsideProvider>
            </body>
        </html>
    )
}
