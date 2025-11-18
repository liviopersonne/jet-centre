import { ViewerProvider } from '@/components/hooks/use-viewer';
import { getViewer } from '@/data/user';

import { DevModeMenu } from './dev-mode-menu';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const viewerResult = await getViewer();

    if (viewerResult.status === 'success') {
    }

    return (
        <ViewerProvider value={viewerResult}>
            {
                <div className="w-full h-full">
                    <div className="absolute top-14 right-4">
                        <DevModeMenu viewerResult={viewerResult} />
                    </div>
                    <div className="w-full h-full">{children}</div>
                </div>
            }
        </ViewerProvider>
    );
}
