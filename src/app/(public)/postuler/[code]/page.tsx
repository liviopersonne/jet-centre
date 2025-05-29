import prisma from '@/db';

import { CandidateForm } from './candidate-form/form';
import { getFormQuestions } from './candidate-form/form-questions';
import { DragAndDrop } from './cv-upload/form';
import { studyDoesntExistPage, studyIsntRecruitingPage } from './invalid-code';

export default async function Postuler({ params }: { params: Promise<{ code: string }> }) {
    const { code: code } = await params;
    const study = await prisma.studyInfos.findUnique({
        where: { code: code },
    });

    if (study === null) {
        return studyDoesntExistPage;
    } else {
        const studyProceedings = await prisma.studyProceedings.findUnique({
            where: { studyId: study.id },
        });
        const studyIsRecruiting = studyProceedings?.studyProcessStep === 'Created';

        if (!studyIsRecruiting) {
            return studyIsntRecruitingPage;
        } else {
            return (
                <div className="h-full flex flex-col gap-8 p-8">
                    <h1 className="w-full text-center text-4xl">
                        {study?.title ?? '<Titre introuvable>'}
                    </h1>
                    <CandidateForm formQuestions={await getFormQuestions(code)} />
                    <DragAndDrop studyCode={code} />
                </div>
            );
        }
    }
}
