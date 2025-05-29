// This page is rendered if the study code entered in the "postuler" url is invalid

import Link from 'next/link';

import { ErrorPage } from '@/components/error';
import { Button } from '@/components/ui/button';

const linkToRectuiringStudies = (
    <Button variant={'link'} asChild>
        <Link href={'/postuler'}>ici</Link>
    </Button>
);
const helpMessage = (
    <h2>Retrouve {linkToRectuiringStudies} toutes les études qui recrutent actuellement.</h2>
);

export const studyDoesntExistPage = ErrorPage({
    title: "Cette étude n'existe pas.",
    children: helpMessage,
});

export const studyIsntRecruitingPage = ErrorPage({
    title: 'Cette étude ne recrute pas actuellement.',
    children: helpMessage,
});
