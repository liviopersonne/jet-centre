/// Warning: this file may end up on the client

import { Gender } from '@/types/misc';

import { Viewer } from './user';

export enum AdminPosition {
    admin = 'admin',
    president = 'president',
    internal_vice_president = 'internal_vice_president',
    operational_vice_president = 'operational_vice_president',
    external_vice_president = 'external_vice_president',
    treasurer = 'treasurer',
    vice_treasurer = 'vice_treasurer',
    general_secretary = 'general_secretary',
    commercial_director = 'commercial_director',
    info = 'info',
}

export type AuthPosition = AdminPosition;

interface PositionNames {
    short: string;
    male: string;
    female: string;
    neutral: string;
}

const positionInfos: Record<AdminPosition, { isExecutive: boolean; names: PositionNames }> = {
    admin: {
        isExecutive: true,
        names: {
            short: 'Admin',
            male: 'Administrateur',
            female: 'Administratrice',
            neutral: 'Administrateur.trice',
        },
    },
    president: {
        isExecutive: true,
        names: { short: 'Prez', male: 'Président', female: 'Présidente', neutral: 'Président.e' },
    },
    internal_vice_president: {
        isExecutive: true,
        names: {
            short: 'VPI',
            male: 'Vice-président interne',
            female: 'Vice-présidente interne',
            neutral: 'Vice-président.e interne',
        },
    },
    operational_vice_president: {
        isExecutive: true,
        names: {
            short: 'VPO',
            male: 'Vice-président opérationnel',
            female: 'Vice-présidente opérationnel',
            neutral: 'Vice-président.e opérationnel',
        },
    },
    external_vice_president: {
        isExecutive: true,
        names: {
            short: 'VPE',
            male: 'Vice-président externe',
            female: 'Vice-présidente externe',
            neutral: 'Vice-président.e externe',
        },
    },
    treasurer: {
        isExecutive: true,
        names: { short: 'Trez', male: 'Trésorier', female: 'Trésorière', neutral: 'Trésorier' },
    },
    vice_treasurer: {
        isExecutive: true,
        names: {
            short: 'VTrez',
            male: 'Vice-trésorier',
            female: 'Vice-trésorière',
            neutral: 'Vice-trésorier.ère',
        },
    },
    general_secretary: {
        isExecutive: true,
        names: {
            short: 'SecGe',
            male: 'Secrétaire général',
            female: 'Secrétaire générale',
            neutral: 'Secrétaire général.e',
        },
    },
    commercial_director: {
        isExecutive: true,
        names: {
            short: 'DirCo',
            male: 'Directeur commercial',
            female: 'Directrice commerciale',
            neutral: 'Directeur.rice commercial.e',
        },
    },
    info: {
        isExecutive: false,
        names: {
            short: 'Info',
            male: 'Membre pôle info',
            female: 'Membre pôle info',
            neutral: 'Membre pôle info',
        },
    },
} as const;

export function getValidPositions(): readonly string[] {
    return Object.keys(AdminPosition);
}

export function isValidPosition(pos: string): pos is AdminPosition {
    return getValidPositions().includes(pos);
}

export function isExecutiveBoard(viewer: Viewer): boolean {
    if (!viewer.position) return false;
    return positionInfos[viewer.position].isExecutive;
}

export function getPositionName(
    position?: string,
    gender?: Gender
): { name: string; shortName: string } {
    if (position && !isValidPosition(position)) {
        return {
            name: 'Invalid',
            shortName: 'Invalid',
        };
    }
    const defaultInfos = {
        isExecutive: false,
        names: {
            short: 'JET',
            male: 'JetMan',
            female: 'JetWoman',
            neutral: 'JetMan/JetWoman',
        },
    };
    const infos = position ? positionInfos[position as AdminPosition] : defaultInfos;
    return {
        name:
            gender === Gender.Male
                ? infos.names.male
                : gender === Gender.Female
                  ? infos.names.female
                  : infos.names.neutral,
        shortName: infos.names.short,
    };
}
