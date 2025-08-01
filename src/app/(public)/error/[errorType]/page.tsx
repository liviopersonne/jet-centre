/**
 * Page rendered when middleware errors occur.
 *
 * See ROUTES in @{file src/routes.ts} for the list of errors that can occur.
 *
 * @file not-found.tsx
 */

import { ErrorPage } from '@/components/error';
import { getErrorDisplayInformation } from '@/routes/errors';

export default async function Page({ params }: { params: Promise<{ errorType: string }> }) {
    const { errorType } = await params;
    const displayInformation = getErrorDisplayInformation(errorType);
    return (
        <ErrorPage title={displayInformation.title}>
            <p className="text-center">{displayInformation.text}</p>
            {displayInformation.children}
        </ErrorPage>
    );
}
