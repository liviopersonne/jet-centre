import { Hammer } from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ViewerResult } from '@/data/user';

import { UserEditor } from '../app/(user)/info/users/user-editor';
import { getAdmins } from '../app/(user)/info/users/users';

interface Admin {
    adminId: string;
    email: string | null;
    position: string | null;
}

export async function DevModeMenu({
    viewerResult,
}: {
    viewerResult: ViewerResult;
}): Promise<ReactNode> {
    if (viewerResult.status === 'error') {
        return;
    }

    let viewerAdmin: Admin | undefined = undefined;

    const admins = await getAdmins();
    for (const admin of admins ?? []) {
        if (admin.userId === viewerResult.viewer.id) {
            viewerAdmin = {
                adminId: admin.id,
                email: viewerResult.viewer.email ?? null,
                position: viewerResult.viewer.position ?? null,
            };
        }
    }

    if (!viewerAdmin) {
        // The user is not an admin
        return;
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="highlight" className="relative rounded-full w-16 h-16 z-50">
                        <Hammer />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="flex justify-center font-bold text-lg">
                        Outils de développement
                    </DropdownMenuLabel>
                    <DropdownMenuLabel>
                        Position actuelle:
                        {
                            <UserEditor
                                email={viewerAdmin.email}
                                adminId={viewerAdmin.adminId}
                                position={viewerAdmin.position}
                            />
                        }
                    </DropdownMenuLabel>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
