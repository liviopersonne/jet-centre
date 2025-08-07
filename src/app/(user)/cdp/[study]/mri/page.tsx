import { createNewMri, loadStudyMris } from '@/app/(user)/cdp/[study]/mri/form/mri';
import { StudyParams } from '@/routes';

import Inner from './inner';

export default async function MRI({ params }: StudyParams) {
    const { study: studyCode } = await params;

    const studyMris = await loadStudyMris(studyCode);

    if (!studyMris) {
        throw new Error('Failed to load MRI');
    }
    if (studyMris.length === 0) {
        createNewMri(studyCode).then((newMriData) => {
            if (newMriData) {
                console.log(
                    `New MRI was successfully created for study ${studyCode}, id=${newMriData}`
                );
                studyMris.push(newMriData);
            } else {
                throw Error('Error while creating a new mri');
            }
        });
    }

    return <Inner studyCode={studyCode} loadedMriData={studyMris} />;
}
