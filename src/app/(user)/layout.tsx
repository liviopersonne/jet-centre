import { DevModeMenu } from '@/components/dev-mode-menu';
import { ViewerProvider } from '@/components/hooks/use-viewer';
import { getViewer } from '@/data/user';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const viewerResult = await getViewer();

    return (
        <ViewerProvider value={viewerResult}>
            {
                <div className="w-full h-full">
                    {process.env.DEV_MODE ? (
                        <div className="absolute top-14 right-4">
                            <DevModeMenu viewerResult={viewerResult} />
                        </div>
                    ) : null}
                    <div className="w-full h-full">{children}</div>
                </div>
            }
        </ViewerProvider>
    );
}
