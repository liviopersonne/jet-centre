'use client';

import { submitCV } from './action';
import { DropableFormElts } from './elts';

export function DragAndDrop({ studyCode: id }: { studyCode: string }) {
    return (
        <form action={(data) => submitCV(id, window.prompt('Votre nom: ') || 'ukn', data)}>
            <DropableFormElts />
        </form>
    );
}
