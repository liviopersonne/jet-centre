import { TopBar } from '@/components/navigation/topbar';

import React from 'react';
import { SidebarApp } from '@/components/navigation/sidebar/sidebar-app';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SessionProvider } from 'next-auth/react';
import { get_user_sidebar_info } from '@/actions/cdp';
import { auth } from '@/actions/auth';

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return (
        <SessionProvider>
            <SidebarProvider>
                <SidebarApp
                    userInfo={await get_user_sidebar_info(session?.user.email || undefined)}
                />
                <SidebarInset>
                    <header className="flex px-4 p-2 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
                        <TopBar />
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <div className="min-h-0 flex-1">{children}</div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </SessionProvider>
    );
}
