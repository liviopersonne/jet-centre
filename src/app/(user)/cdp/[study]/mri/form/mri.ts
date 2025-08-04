'use server';

import { MriStatus } from '@prisma/client';

import prisma from '@/db';
import { dbg } from '@/lib/utils';

import { adminDisplay, DEFAULT_MRI_VALUES, MriFormType, MriServerData } from './schema';

// TODO: Replace loadMriData by loadStudyMris
export async function loadStudyMris(code: string): Promise<MriServerData[]> {
    try {
        const infos = await prisma.studyInfos.findUnique({
            where: { code },
            include: {
                study: {
                    include: {
                        mri: true,
                        cdps: {
                            include: {
                                user: {
                                    include: { person: true },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!infos) {
            throw new Error('Failed to fetch mission in database.');
        }
        const study = infos.study;
        if (!study) {
            throw new Error('studyInfo exists without study.');
        }
        const mris = study.mri;
        if (mris.length > 0) {
            return mris.map((mri) => {
                const data: MriFormType = {
                    title: mri?.title || infos?.title || DEFAULT_MRI_VALUES.title,
                    wageLowerBound: mri?.wageLowerBound ?? DEFAULT_MRI_VALUES.wageLowerBound,
                    wageUpperBound: mri?.wageUpperBound ?? DEFAULT_MRI_VALUES.wageUpperBound,
                    wageLevel: mri?.wageLevel ?? DEFAULT_MRI_VALUES.wageLevel,
                    difficulty: mri?.difficulty ?? DEFAULT_MRI_VALUES.difficulty,
                    mainDomain:
                        mri?.mainDomain || infos.domains[0] || DEFAULT_MRI_VALUES.mainDomain,
                    introductionText: mri?.introductionText ?? DEFAULT_MRI_VALUES.introductionText,
                    descriptionText: mri?.descriptionText ?? DEFAULT_MRI_VALUES.descriptionText,
                    timeLapsText: mri?.timeLapsText ?? DEFAULT_MRI_VALUES.timeLapsText,
                    requiredSkillsText:
                        mri?.requiredSkillsText ?? DEFAULT_MRI_VALUES.requiredSkillsText,
                };
                return {
                    mriId: mri.id,
                    admins: study.cdps.map(adminDisplay),
                    data,
                    status: mri?.status || MriStatus.InProgress,
                };
            });
        } else {
            return [
                {
                    mriId: undefined,
                    admins: study.cdps.map(adminDisplay),
                    status: MriStatus.InProgress,
                    data: {
                        ...DEFAULT_MRI_VALUES,
                        title: infos?.title || DEFAULT_MRI_VALUES.title,
                        mainDomain: infos.domains[0] || DEFAULT_MRI_VALUES.mainDomain,
                    },
                },
            ];
        }
    } catch (e) {
        throw new Error(`[loadStudyMris] ${e}`);
    }
}

// TODO: Adapt
export async function storeMriData(
    mriId: string | undefined,
    studyCode: string,
    data: MriFormType
): Promise<string | undefined> {
    try {
        const mriData = {
            title: data.title,
            wageLowerBound: data.wageLowerBound,
            wageUpperBound: data.wageUpperBound,
            wageLevel: data.wageLevel,
            difficulty: data.difficulty,
            mainDomain: data.mainDomain,
            introductionText: data.introductionText,
            descriptionText: data.descriptionText,
            timeLapsText: data.timeLapsText,
            requiredSkillsText: data.requiredSkillsText,
            status: MriStatus.InProgress,
        };

        dbg(mriData, 'storing');

        if (mriId !== undefined) {
            const updatedMri = await prisma.mri.update({
                where: { id: mriId },
                data: { ...mriData },
            });
            return updatedMri.id;
        } else {
            const newMri = await prisma.mri.create({
                data: {
                    studyId: studyCode,
                    ...mriData,
                },
            });
            return newMri.id;
        }
    } catch (e) {
        console.error(`[storeMriData] ${e}`);
    }
}

export async function setMriStatus(mriId: string, status: MriStatus) {
    try {
        return await prisma.mri.update({
            where: { id: mriId },
            data: { status },
        });
    } catch (e) {
        console.error(`[validateMri] ${e}`);
    }
}
