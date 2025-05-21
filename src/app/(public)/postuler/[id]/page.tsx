import prisma from '@/db';

import { CandidateForm } from './candidate-form/form';
import { getFormQuestions } from './candidate-form/form-questions';
import { DragAndDrop } from './cv-upload/form';

export default async function Postuler({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const mission = await prisma.studyInfos.findUnique({
        where: { id: id },
    });

    return (
        <div className="h-full flex flex-col gap-8 p-8">
            <h1 className="w-full text-center text-4xl">{mission?.title ?? 'jeej'}</h1>
            <CandidateForm formQuestions={await getFormQuestions(id)} />
            <DragAndDrop studyId={id} />
        </div>
    );
}
