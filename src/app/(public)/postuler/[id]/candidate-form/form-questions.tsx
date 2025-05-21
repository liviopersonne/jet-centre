import { Path } from 'react-hook-form';
import * as z from 'zod';

export type formQuestion = {
    key: number;
    label: string;
    name: Path<z.infer<typeof formSchema>>; // The value of name is one of the elements defined in formSchema
    type: 'singleLine' | 'multiline' | 'checkbox';
};

export const formSchema = z.object({
    firstName: z
        .string({ required_error: 'Cette question est obligatoire.' })
        .min(2, 'Le prénom doit faire au moins 2 caractères.'),
    lastName: z
        .string({ required_error: 'Cette question est obligatoire.' })
        .min(2, 'Le nom doit faire au moins 2 caractères.'),
    email: z
        .string({ required_error: 'Cette question est obligatoire.' })
        .email('Email non valide.'),
    yearAndMajors: z.string({ required_error: 'Cette question est obligatoire.' }),
    isYoungerThan27: z.literal(true, {
        errorMap: () => ({ message: 'Vous devez avoir moins de 27 ans pour être intervenant.' }),
    }),
    experience: z.string({ required_error: 'Cette question est obligatoire.' }),
    ideas: z.string({ required_error: 'Cette question est obligatoire.' }),
    time: z.string({ required_error: 'Cette question est obligatoire.' }),
    jeExperience: z.string({ required_error: 'Cette question est obligatoire.' }),
});

//TODO: Add experience domain from study query

export async function getFormQuestions(studyId: string): Promise<formQuestion[]> {
    return [
        { key: -1, label: studyId, name: 'firstName', type: 'singleLine' },
        { key: 0, label: 'Prénom', name: 'firstName', type: 'singleLine' },
        { key: 1, label: 'Nom', name: 'lastName', type: 'singleLine' },
        { key: 2, label: 'Email', name: 'email', type: 'singleLine' },
        {
            key: 3,
            label: "Année d'étude actuelle, et filières suivies à Télécom Paris (si applicable)",
            name: 'yearAndMajors',
            type: 'singleLine',
        },
        {
            key: 4,
            label: 'Est-ce que tu as moins de 27 ans ?',
            name: 'isYoungerThan27',
            type: 'checkbox',
        },
        {
            key: 5,
            label: 'En quelques mots, quelle est ton expérience dans XXX ?',
            name: 'experience',
            type: 'multiline',
        },
        {
            key: 6,
            label: "En quelques mots, comment comptes-tu t'y prendre pour réaliser cette étude ? ",
            name: 'ideas',
            type: 'multiline',
        },
        {
            key: 7,
            label: "Combien d'heures de travail penses-tu pouvoir consacrer au projet par semaine ? Précise, si possible, une fourchette horaire.",
            name: 'time',
            type: 'multiline',
        },
        {
            key: 8,
            label: 'Quelle est ton expérience avec la Junior-Entreprise ? (As-tu déjà postulé ou réalisé une étude, ou est-ce la première fois ?)',
            name: 'jeExperience',
            type: 'multiline',
        },
    ];
}
